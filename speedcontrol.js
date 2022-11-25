var vController = vController || {};

var hed=[...document.getElementsByTagName("head")][0];
var bdy=[...document.getElementsByTagName("body")][0];
var bls=[];

function keepMatchesShadow(els,slc,isNodeName){
   if(slc===false){
      return els;
   }else{
      let out=[];
   for(let i=0, len=els.length; i<len; i++){
      let n=els[i];
           if(isNodeName){
	            if((n.nodeName.toLocaleLowerCase())===slc){
	                out.push(n);
	            }
           }else{ //selector
	               if(!!n.matches && typeof n.matches!=='undefined' && n.matches(slc)){
	                  out.push(n);
	               }
           }
   	}
   	return out;
   	}
}

function getMatchingNodesShadow(docm, slc, isNodeName, onlyShadowRoots){
slc=(isNodeName && slc!==false)?(slc.toLocaleLowerCase()):slc;
var shrc=[docm];
var shrc_l=1;
var out=[];
let srCnt=0;

while(srCnt<shrc_l){
	let curr=shrc[srCnt];
	let sh=(!!curr.shadowRoot && typeof curr.shadowRoot !=='undefined')?true:false;
	let nk=keepMatchesShadow([curr],slc,isNodeName);
	let nk_l=nk.length;
	
	if( !onlyShadowRoots && nk_l>0){  
		out.push(...nk);
	}
	
	shrc.push(...curr.childNodes);
	
	if(sh){
		   let cs=curr.shadowRoot;
		   let csc=[...cs.childNodes];
			   if(onlyShadowRoots){
			      if(nk_l>0){
			       out.push({root:nk[0], childNodes:csc});
			      }
			   }
			   shrc.push(...csc);
	}

	srCnt++;
	shrc_l=shrc.length;
}

return out;
}

var isolator_HTML="*:not(video):not(audio):not(.vController-video-control){visibility:hidden !important;} video::-webkit-media-controls{display: flex !important; opacity: 1 !important;}";

var hideControls_HTML="video::-webkit-media-controls{opacity: 0 !important; pointer-events: none !important;}";

function elRemover(el){
	if(typeof el!=='undefined' && !!el){
	if(typeof el.parentNode!=='undefined' && !!el.parentNode){
		el.parentNode.removeChild(el);
	}
	}
}

function ifAnyOf(el,arr){
	let out=false
	for(let i=0; i<arr.length; i++){
		if(el===arr[i]){
			out=true;
			break;
		}
	}
	return out;
}

function getSrc(vid){
	if (vid.src !== "") {
		return vid.src;
	} else if (vid.currentSrc !== "") {
		return vid.currentSrc;
	}else{
		return '';
	}
}

function eligVid(vid){
if((getSrc(vid)!='') && (vid.readyState != 0)){
	return true;
}else{
	return false;
}
}


function getMax(a,b){
	 return ((b>a) ? b : a);
}

function vttURL(t)
{
	let textFileAsBlob = new Blob([t],
	{
		type: 'text/vtt'
	});
	return window.URL.createObjectURL(textFileAsBlob);
}

function findIndexTotalInsens(string, substring, index) {
    string = string.toLocaleLowerCase();
    substring = substring.toLocaleLowerCase();
    for (let i = 0; i < string.length ; i++) {
        if ((string.includes(substring, i)) && (!(string.includes(substring, i + 1)))) {
            index.push(i);
            break;
        }
    }
    return index;
}

function blacklistMatch(array, t) {
    var found = false;
	var blSite='';
    if (!((array.length == 1 && array[0] == "") || (array.length == 0))) {
        ts = t.toLocaleLowerCase();
        for (var i = 0; i < array.length; i++) {
            let spl = array[i].split('*');
            spl = removeEls("", spl);

            var spl_mt = [];
            for (let k = 0; k < spl.length; k++) {
                var spl_m = [];
                findIndexTotalInsens(ts, spl[k], spl_m);

                spl_mt.push(spl_m);


            }

            found = true;

            if ((spl_mt.length == 1) && (typeof spl_mt[0][0] === "undefined")) {
                found = false;
            } else if (!((spl_mt.length == 1) && (typeof spl_mt[0][0] !== "undefined"))) {

                for (let m = 0; m < spl_mt.length - 1; m++) {

                    if ((typeof spl_mt[m][0] === "undefined") || (typeof spl_mt[m + 1][0] === "undefined")) {
                        found = false;
                        m = spl_mt.length - 2; //EARLY TERMINATE
                    } else if (!(spl_mt[m + 1][0] > spl_mt[m][0])) {
                        found = false;
                    }
                }

            }
			if(found){
				blSite = array[i];
				i = array.length - 1;
			}
        }
    }
    //console.log(found);
    return [found,blSite];

}

function removeEls(d, array)
{
	var newArray = [];
	for (let i = 0; i < array.length; i++)
	{
		if (array[i] != d)
		{
			newArray.push(array[i]);
		}
	}
	return newArray;
}



var sets = [];
var objs = [];

var scrSpd; //scroll over to change speed
var pRIncrement; //speed change
var sIncrement; //seek secs
var Alt_no; //Alt + number keys to switch speed
var colMat; //use color matrix
var clrMtrx; //color matrix
var blacklist;
var subsStyl; //CSS for the subtitles
var videoCSS; //CSS for the video
var vidCSS; //Use CSS for the video
var sDel; //Delay change for subs
var sDelF; //Fine delay change for subs
var sMv; //% to move subs up and down
var swtchTo = 1; //Switch to and from this speed
var pR1 = 1;

restore_options();

function restore_options()
{

	chrome.storage.sync.get(null, function(items)
	{
		if (Object.keys(items).length !== 0)
		{
			//console.log(items);
			objs = items.scObjs;
			sets = items.settgs;

			scrSpd = sets[0].s;
			pRIncrement = sets[1].s * 1;
			sIncrement = sets[2].s * 1;
			Alt_no = sets[3].s;
			colMat = sets[4].s;
			clrMtrx = sets[5].s;
			blacklist = sets[6].s.split('\n').join('').split(',');
			subsStyl = sets[8].s;
			videoCSS = sets[9].s;
			vidCSS = sets[10].s;
			sDel = sets[11].s * 1;
			sDelF = sets[12].s * 1;
			sMv = sets[13].s * 1;
			swtchTo = sets[14].s;
			subsStylTwo = sets[15].s;
			pR1 = swtchTo;

			runExt();
		}
		else
		{
			save_options();
		}
	});

}

function save_options()
{

	sets = [
	{
		"n": "scrSpd",
		"s": true
	},
	{
		"n": "pRIncrement",
		"s": "0.01"
	},
	{
		"n": "sIncrement",
		"s": "3"
	},
	{
		"n": "Alt_no",
		"s": true
	},
	{
		"n": "colMat",
		"s": true
	},
	{
		"n": "clrMtrx",
		"s": "1.036 -0.0286 0.0005 0 -0.0041 -0.1218 1.2056 -0.0745 0 -0.0003 -0.0147 0.002 1.0219 0 -0.0046 0 0 0 1 0"
	},
	{
		"n": "blacklist",
		"s": ""
	},
	{
		"n": "selFont",
		"s": 0
	},
	{
		"n": "subsStyl",
		"s": "background-color: transparent;\ncolor: #ffff00;\nfont-size: 148%;\nfont-weight: bold;\ntext-shadow: 0.02em 0.05em black, 0.06em 0.02em black, -0.09em -0.01em black, 0.09em 0.05em black;\nfont-family: Segoe UI;"
	},
	{
		"n": "videoCSS",
		"s": "brightness(1)\ncontrast(1)\nsaturate(1)\nhue-rotate(0deg)\ninvert(0)\nsepia(0)\nblur(0px)\n !important;"
	},
	{
		"n": "vidCSS",
		"s": false
	},
	{
		"n": "sDel",
		"s": "100"
	},
	{
		"n": "sDelF",
		"s": "20"
	},
	{
		"n": "sMv",
		"s": "1"
	},
	{
		"n": "swtchTo",
		"s": "1"
	},
	{
		n: "subsStylTwo",
		s: "transform: translate(0%, -94%) scale(0.9,1);\n-webkit-transform: translate(0%, -94%) scale(0.9,1);"
	}];

	objs = [
	{
		"o":
		{
			"id": "plusSpd",
			"ctrl": null,
			"alt": null,
			"shift": null,
			"code": "Period",
			"dispKey": ".",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "minusSpd",
			"ctrl": null,
			"alt": null,
			"shift": null,
			"code": "Comma",
			"dispKey": ",",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "switchSpd",
			"ctrl": null,
			"alt": true,
			"shift": null,
			"code": "Backquote",
			"dispKey": "Dead",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "bck",
			"ctrl": null,
			"alt": null,
			"shift": null,
			"code": "BracketLeft",
			"dispKey": "[",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "fwrd",
			"ctrl": null,
			"alt": null,
			"shift": null,
			"code": "BracketRight",
			"dispKey": "]",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "hideCtrlr",
			"ctrl": null,
			"alt": null,
			"shift": null,
			"code": "Quote",
			"dispKey": "'",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sDelBUp",
			"ctrl": null,
			"alt": true,
			"shift": null,
			"code": "ArrowUp",
			"dispKey": "ArrowUp",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sDelBDwn",
			"ctrl": null,
			"alt": true,
			"shift": null,
			"code": "ArrowDown",
			"dispKey": "ArrowDown",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sDelBFUp",
			"ctrl": null,
			"alt": true,
			"shift": true,
			"code": "ArrowUp",
			"dispKey": "ArrowUp",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sDelBFDwn",
			"ctrl": null,
			"alt": true,
			"shift": true,
			"code": "ArrowDown",
			"dispKey": "ArrowDown",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sDelB1Up",
			"ctrl": true,
			"alt": true,
			"shift": true,
			"code": "ArrowUp",
			"dispKey": "ArrowUp",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sDelB1Dwn",
			"ctrl": true,
			"alt": true,
			"shift": true,
			"code": "ArrowDown",
			"dispKey": "ArrowDown",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sMvUp",
			"ctrl": true,
			"alt": null,
			"shift": true,
			"code": "ArrowUp",
			"dispKey": "ArrowUp",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	},
	{
		"o":
		{
			"id": "sMvDwn",
			"ctrl": true,
			"alt": null,
			"shift": true,
			"code": "ArrowDown",
			"dispKey": "ArrowDown",
			"wheelDeltaX": null,
			"wheelDeltaY": null
		}
	}];

	chrome.storage.sync.set(
	{
		scObjs: objs,
		settgs: sets
	}, function()
	{
		console.log('Default options saved.');
		restore_options();
	});

}

function runExt()
{

	var isCurrentSiteBlacklisted = function()
	{
		return blacklistMatch(blacklist, window.location.href);
	};

	vController.vidControl = function(targetEl)
	{
		this.el_ = null;

		this.bgEl_ = null;

		this.videoEl_ = targetEl;

		this.speedIndicator_ = null;

		this.closeButton_ = null;
		
		let isBl=isCurrentSiteBlacklisted();
		
		var hcs = document.createElement('style');
		this.videoEl_.appendChild(hcs);
		
		this.hideControlTag=hcs;
		
		this.hideControlTagNext=false;
		
		if(typeof v_observer ==="undefined"){
			const v_observer = new MutationObserver((mutations) =>
			{
				let vix=-1;
				let mix=-1;
				
				for(let i=0, len_i=mutations.length; i<len_i; i++){
					let mi=mutations[i];
					for(let j=0, len_j=vController.vidControl.instances.length; j<len_j; j++){
						let vis=vController.vidControl.instances[j];
						if(mi.target===vis.videoEl_){
							vix=j;
							mix=i;
							j=len_j-1;
							i=len_i-1;
						}
					}
				}
				
				if(vix>=0){ //video in mutation found in instances array
					let m=mutations[mix];
					let cv=vController.vidControl.instances[vix];
					if(cv.hideControlTagNext){
						if(m.target.controls===true){
							cv.hideControlTag.innerHTML=hideControls_HTML;
							cv.hideControlTagNext=false;
						}
					}else{
						cv.hideControlTag.innerHTML='';
					}
				}
				
			});

			v_observer.observe(targetEl,
			{
				attributeFilter: ["controls"]
			});
		}
		
		if (!isBl[0])
		{
			if(this.videoEl_.tagName=="VIDEO"){
				
				if (colMat)
				{

					var divm = document.createElement('div');
					divm.innerHTML = "<svg><filter id='filter-sample'><feColorMatrix type='matrix' values='" + clrMtrx + "'></feColorMatrix></filter></svg>";

					divm.setAttribute('id', 'filter-sample_div');
					divm.setAttribute('style', 'display: none;');
					if (document.getElementById('filter-sample_div'))
					{
						document.getElementById('filter-sample_div').remove();
					}
					this.videoEl_.appendChild(divm);

					console.log(divm);

					if (vidCSS)
					{

						this.videoEl_.style.cssText = this.videoEl_.style.cssText + ' filter: url("#filter-sample") ' + videoCSS;

					}
					else
					{

						this.videoEl_.style.cssText = this.videoEl_.style.cssText + ' filter: url("#filter-sample") !important;';

					}

				}else{

					if (vidCSS)
					{

						this.videoEl_.style.cssText = this.videoEl_.style.cssText + ' filter: ' + videoCSS;

					}

				}
			}

			this.createDom();
			this.enterDocument();
			vController.vidControl.instances.push(this);
			if (vController.vidControl.instances.length>1){
			console.log(vController.vidControl.instances);
			}else{
			console.log(vController.vidControl.instances[0]);
			}
			this.videoEl_.setAttribute('def_ctrls', this.videoEl_.controls);
		}
		else
		{
			if(!bls.includes(isBl[1])){
				bls.push(isBl[1]);
				console.warn('Current site is blacklisted from speed controller ("'+isBl[1]+'")');
			}
		}
	};

	vController.vidControl.CLASS_NAME = 'vController-video-control';

	vController.vidControl.instances = [];

	/*vController.vidControl.deleteAll = function()
	{
		instances.forEach((instance) => instance.delete());
		instances = [];
	}*/
	
	vController.vidControl.prototype.createDom = function()
	{
		var container = document.createElement('div');
		var shadow = container.attachShadow(
		{
			mode: 'open'
		});
		var shadowStyle = `
        <style>

button.vController-btn {
    color: black;
    background: white;
    font-weight: bold;
    border-radius: 3px;
    font-size: 14px;
    line-height: 16px;
    border: 1px solid white;
    font-family: "Lucida Console", Monaco, monospace;
    margin-bottom: 3px;
    padding: -3px 0px 2px 0px;
    margin-right: 2px;
}

input[type="text"].vController-btn {
    color: black;
    background: white;
    font-weight: bold;
    border-radius: 3px;
    font-size: 14px;
    line-height: 16px;
    border: 1px solid white;
    margin-bottom: 3px;
    padding: 0px 0px 2px 1px;
    margin-right: 2px;
}

input[type="file" i]::-webkit-file-upload-button {
    background-color: buttonface;
}

span.speed-indicator{
    margin-right: 4px;
}	
        </style>
		`;
		shadow.innerHTML += shadowStyle;
		var bg = document.createElement('div');
		var speedIndicator = document.createElement('span');
		var switchButton = document.createElement('button');
		var minusButton = document.createElement('button');
		var plusButton = document.createElement('button');
		var backButton = document.createElement('button');
		var forwardButton = document.createElement('button');
		var linkButton = document.createElement('button');
		var subsButton = document.createElement('button');
		var closeButton = document.createElement('button');
		shadow.appendChild(bg);
		bg.appendChild(speedIndicator);
		bg.appendChild(switchButton);
		bg.appendChild(backButton);
		bg.appendChild(minusButton);
		bg.appendChild(plusButton);
		bg.appendChild(forwardButton);
		bg.appendChild(linkButton);
		
		this.lnk_ = {dom: 0};
		this.lnk_.dom = document.createElement('input');
		this.lnk_.dom.type = 'text';
		this.lnk_.dom.style.display = 'none';
		this.lnk_.dom.style.marginLeft="1px";
		
		bg.appendChild(this.lnk_.dom);
		bg.appendChild(subsButton);
		bg.appendChild(closeButton);
		bg.classList.add('vController-bg');
		speedIndicator.classList.add('speed-indicator');
		switchButton.classList.add('vController-btn', 'switcher');
		switchButton.textContent = swtchTo + 'x';
		backButton.textContent = '↶';
		backButton.classList.add('vController-btn', 'back');
		minusButton.textContent = '-';
		minusButton.classList.add('vController-btn', 'decrease');
		plusButton.textContent = '+';
		plusButton.classList.add('vController-btn', 'increase');
		forwardButton.textContent = '↷';
		forwardButton.classList.add('vController-btn', 'forwards');
		linkButton.textContent = '🔗';
		linkButton.classList.add('vController-btn', 'link');
		this.lnk_.dom.classList.add('vController-btn', 'srcTxt');
		subsButton.textContent = '_';
		subsButton.classList.add('vController-btn', 'subs');
		closeButton.textContent = '🗙';
		closeButton.classList.add('vController-btn', 'vController-close-button');

		this.videoEl_.insertAdjacentElement('beforebegin', container);

		this.videoEl_.classList.add('vController-video');
		this.el_ = container;
		this.el_.classList.add(vController.vidControl.CLASS_NAME);
		this.el_.style.zIndex=Number.MAX_SAFE_INTEGER;
		this.el_.style.position='absolute';
		this.el_.style.top='0px';
		this.el_.style.left='0px';
		this.el_.setAttribute('baseX',0);
		this.el_.setAttribute('baseY',0);
		this.bgEl_ = bg;
		this.speedIndicator_ = speedIndicator;
		this.switchButton_ = switchButton;
		this.backButton_ = backButton;
		this.minusButton_ = minusButton;
		this.plusButton_ = plusButton;
		this.forwardButton_ = forwardButton;
		this.linkButton_ = linkButton;
		this.subsButton_ = subsButton;
		this.closeButton_ = closeButton;
		this.barButtonsArr_=[this.switchButton_,this.backButton_, this.minusButton_, this.plusButton_,this.forwardButton_,this.linkButton_,this.subsButton_,this.closeButton_];
		this.isol_=0;
		//this.defOpacity_ = this.el_.style.opacity;
		this.openSRT_={};
		this.subti_ = {dom: 0};
		this.is_vtt_ = false;
		this.fc_hv_={lnk_fc: false,	subti_fc: false, bar_hv: false};
		this.s_ = {track: 0, origTrack: 0, vtt: "WEBVTT\n\n00:00:00.000 --> 9999:59:59.999\n", d: 0, delIndicator: 0, blcd: 0};
		this.permashow_=0;
		this.permahide_=0;
		this.tmpScObj_={
						id: null,
						ctrl: null,
						alt: null,
						shift: null,
						code: null,
						dispKey: null,
						wheelDeltaX: null,
						wheelDeltaY: null
						};
		this.scCompareS_=[];
		this.scCompareE_=[];
		this.subButnStatus_=null;
		this.hideMulti_ = 0;
		this.lkButnStatus_ = 0;
		
	};

	var disap;

	function c_hide(c, d, v, self)
	{
		function showHide()
		{
			
		  v.controls=(self.isol_==1)?true:v.controls;
		  
			function shwHde(t)
			{
				
				self.hideMulti_++;
				
				c.style.display = 'initial';
				c.style.visibility = 'initial';
				c.style.opacity = '';
				
				disap = setTimeout(hideCtl, t);


				function hideCtl()
				{
				if ((self.permashow_ !== 1) && (hvrChk(self) == false))
				{
					//c.style.display = 'none';
					//c.style.visibility = 'hidden';
					c.style.opacity = '0';
					self.hideMulti_ = 0;
				}
				}
			}
			
			if ((self.permashow_!=1)&&(self.permahide_!=1)){
				if (self.hideMulti_ == 0)
				{
					shwHde(3000);
				}
				else
				{
					clearTimeout(disap);
					shwHde(3000);
				}
			}
		}

		function hvrChk(self)
		{

			if ((self.fc_hv_.bar_hv) || (self.fc_hv_.lnk_fc) || (self.fc_hv_.subti_fc))
			{

				return true;
			}
			else
			{
				return false;
			}
		}

		showHide();

		v.addEventListener('mousemove', showHide,true);

	}

	vController.vidControl.prototype.enterDocument = function()
	{
		var self = this;
		var mouseDownHandler = self.handleMouseDown_.bind(self);
		var mouseUpHandler = self.handleMouseUp_.bind(self);
		var wheelHandler = self.handleWheel_.bind(self);
		var dblClickHandler = self.handleDblClick_.bind(self);
		var clickHandler = self.handleClick_.bind(self);
		var keydownHandler = self.handleKeyDown_.bind(self);
		var mouseOverHandler = self.handleMouseOver_.bind(self);
		var mouseOutHandler = self.handleMouseOut_.bind(self);
		var focusHandler = self.handleFocus_.bind(self);
		var focusOutHandler = self.handleFocusOut_.bind(self);
		var dragStartHandler = self.handleDragStartEvent_.bind(self);
		var dragHandler = self.handleDragEndEvent_.bind(self);
		
		self.el_.addEventListener('mouseover', mouseOverHandler, true);
		self.el_.addEventListener('mouseout', mouseOutHandler, true);
		self.bgEl_.addEventListener('focus', focusHandler, true);
		self.bgEl_.addEventListener('focusout', focusOutHandler, true);
		self.bgEl_.addEventListener('mousedown', mouseDownHandler, true);
		self.bgEl_.addEventListener('mouseup', mouseUpHandler, true);
		self.bgEl_.addEventListener('dblclick', dblClickHandler, true);
		self.bgEl_.addEventListener('click', clickHandler, true);
		self.bgEl_.addEventListener('wheel', wheelHandler, true);
		
		window.addEventListener('keydown', keydownHandler, true);
		window.addEventListener('dragstart', dragStartHandler, true);
		window.addEventListener('dragend', dragHandler, true);
		
		self.el_.setAttribute('draggable', true);
		self.lnk_.dom.value=getSrc(self.videoEl_);
		self.speedIndicator_.textContent = self.rmng();
		self.switchButton_.textContent = self.swtch();
		self.videoEl_.addEventListener('canplay', function()
		{
			self.speedIndicator_.textContent = self.rmng();
		});
		self.videoEl_.addEventListener('progress', function()
		{
			self.speedIndicator_.textContent = self.rmng();
		});
		self.videoEl_.addEventListener('durationchange', function()
		{
			self.lnk_.dom.value=getSrc(self.videoEl_);
			self.speedIndicator_.textContent = self.rmng();
		});
		self.videoEl_.addEventListener('loadedmetadata', function()
		{
			self.lnk_.dom.value=getSrc(self.videoEl_);
			self.speedIndicator_.textContent = self.rmng();
		});
		self.videoEl_.addEventListener('ratechange', function()
		{
			self.speedIndicator_.textContent = self.rmng();
			self.switchButton_.textContent = self.swtch();
		});
		self.videoEl_.addEventListener('timeupdate', function()
		{
			self.speedIndicator_.textContent = self.rmng();
			if (self.s_.track !== 0)
			{
				if (self.s_.track.track.mode == "showing")
				{
					self.subsButton_.style.backgroundColor = "#36ff07";
					self.subButnStatus_ = 1;
				}

				if (self.s_.track.track.mode == "hidden")
				{
					self.subsButton_.style.backgroundColor = "#ff57ff";
					self.subButnStatus_ = 3;
				}
				if (self.s_.track.track.mode == "disabled")
				{
					self.subsButton_.style.backgroundColor = "#c00000";
					self.subButnStatus_ = 3;
				}
			}
		});
		
		self.videoEl_.addEventListener('mouseenter', c_hide(self.el_, self.bgEl_, self.videoEl_, self), true);
	};

	vController.vidControl.prototype.goBack = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);
		this.videoEl_.currentTime -= sIncrement;
	};

	vController.vidControl.prototype.decreaseSpeed = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);
		this.videoEl_.playbackRate -= pRIncrement;
	};

	vController.vidControl.prototype.increaseSpeed = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);
		this.videoEl_.playbackRate += pRIncrement;
	};

	vController.vidControl.prototype.goForwards = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);
		this.videoEl_.currentTime += sIncrement;
	};

	var thisSub;
	var subsCSS;
	
	
	function subUpDwn(n)
	{

		let mvL = subsCSS.innerHTML.match(/translate(.|\n)+?\)/g);
		let vtPos = [];
		let mvLN = [];
		for (i = 0; i < mvL.length; i++)
		{
			vtPos.push(mvL[i].split(',')[1].split('%')[0].split('\n').join('').split(' ').join(''));
			vtPos[i] = vtPos[i] * 1 + n * 1;
		}
		for (i = 0; i < vtPos.length; i++)
		{
			mvLN.push(mvL[0].split(mvL[0].split(',')[1]).join(vtPos[i] + '%)'));
			subsCSS.innerHTML = subsCSS.innerHTML.split(mvL[i]).join(mvLN[i]);
		}
		
		console.log((mvL[0].split(mvL[0].split(',')[1])).join(((mvL[0].split(',')[1].split('%')[0].split('\n').join('').split(' ').join(''))*1+n*1)+'%)'));
		
	}

	function subsDelay(track, origTrack, d, v, elm, bgElm, self)
	{

		function do_del()
		{
			c_hide(elm, bgElm, v, self);

			track.mode = "hidden";

			for (let i = 0; i < track.track.cues.length; i++)
			{
				if (origTrack.start[i] * 1 + d / 1000 < 0)
				{
					track.track.cues[i].startTime = 0;
					track.track.cues[i].endTime = 0;
					track.track.cues[i].text = '';
				}
				else
				{
					track.track.cues[i].startTime = origTrack.start[i] * 1 + d / 1000;
					track.track.cues[i].endTime = origTrack.end[i] * 1 + d / 1000;
					track.track.cues[i].text = origTrack.text[i];
				}
			}

			for (let k = 0; k < track.track.cues.length - 1; k++)
			{
				if(k==0)
				{
				if(v.currentTime < track.track.cues[k].startTime)
				{
					console.log('"' + track.track.cues[k].text + '" ' + 'will start ' + ((track.track.cues[k].startTime-v.currentTime) * 1000).toLocaleString('en-GB',
					{
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 7
					}) + ' ms from now');
					k = track.track.cues.length - 2;
				}
					
				}else{
					
				if ((v.currentTime > track.track.cues[k].startTime) && (v.currentTime < track.track.cues[k + 1].startTime))
				{
					console.log(d + ' ms delay: \n\n' + '"' + track.track.cues[k].text + '" ' + 'started ' + ((v.currentTime - track.track.cues[k].startTime) * 1000).toLocaleString('en-GB',
					{
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 7
					}) + ' ms ago' + '\n\n' + '"' + track.track.cues[k + 1].text + '" ' + 'will start ' + ((track.track.cues[k + 1].startTime - v.currentTime) * 1000).toLocaleString('en-GB',
					{
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 7
					}) + ' ms from now');
					k = track.track.cues.length - 2;
				}

				if ((v.currentTime == track.track.cues[k].startTime) && (v.currentTime < track.track.cues[k + 1].startTime))
				{
					console.log('"' + track.track.cues[k].text + '" ' + 'started now' + '\n\n' + '"' + track.track.cues[k + 1].text + '" ' + 'will start ' + ((track.track.cues[k + 1].startTime - v.currentTime) * 1000).toLocaleString('en-GB',
					{
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 7
					}) + ' ms from now');
					k = track.track.cues.length - 2;
				}

				if ((v.currentTime > track.track.cues[k].startTime) && (v.currentTime > track.track.cues[k + 1].startTime) && (track.track.cues[k + 2] == undefined))
				{
					console.log('"' + track.track.cues[k + 1].text + '" ' + 'started ' + ((v.currentTime - track.track.cues[k + 1].startTime) * 1000).toLocaleString('en-GB',
					{
						useGrouping: false,
						minimumFractionDigits: 0,
						maximumFractionDigits: 7
					}) + ' ms ago');
					k = track.track.cues.length - 2;
				}
			}
			}

			track.mode = "showing";
			self.s_.delIndicator.textContent = d + ' ms';

		}
		
		if(self.s_.origTrack!=0){
			if (!v.paused)
			{
				v.pause();
				do_del();
				v.play();
			}
			else
			{

				do_del();
			}
		}
	}

	function get_tags (spr)
	{
	
	var out_tags=[];
	var start_tags=[];
	var end_tags=[];
	for (var i=0; i<spr.length; i++){
	
	var out_line;
	var start_pos=-1;

	if ((spr[i]=='<')&&(i<spr.length-1)){
		out_line='<';
		for (var k=i+1; k<spr.length; k++){
		start_pos=i;
		if (spr[k]=='<'){
		k=spr.length-1;
		}else if (spr[k]=='>'){
		out_line+='>';
		out_tags.push(out_line);
		start_tags.push(parseInt(start_pos));
		end_tags.push(parseInt(k));
		k=spr.length-1;
		}else{
		out_line+=spr[k];
		}
		
		}
	
	}else if ((spr[i]=='>')&&(i>spr.length-1)){
		out_line='>';
		for (var k=i+1; k>spr.length; k++){
		start_pos=i;
		if (spr[k]=='>'){
		k=spr.length-1;
		}else if (spr[k]=='<'){
		out_line+='<';
		out_tags.push(out_line);
		start_tags.push(parseInt(start_pos));
		end_tags.push(parseInt(k));
		k=spr.length-1;
		}else{
		out_line+=spr[k];
		}
		
		}
	
	}
	
	}
	return [out_tags,start_tags,end_tags];
	}

	function balanceSubs(self)
	{
		if(self.s_.track != 0)
		{
		if (self.s_.blcd !== 1)
		{
			self.s_.track.track.mode = "hidden";
			for (let i = 0; i < self.s_.track.track.cues.length; i++)
			{
				var subtitleCurr = self.s_.track.track.cues[i].text.split('\n');
				for (let k=0; k<subtitleCurr.length;k++){
					var spread=[...subtitleCurr[k]];
					var line_tags=get_tags(spread); 
					var de_tag=subtitleCurr[k];
					dtag= Array.from(new Set(line_tags[0]));
					if(dtag.length>0){
					for (let m=0; m<dtag.length; m++){
					de_tag=de_tag.split(dtag[m]).join('');
					}
					}
					var de_tag_spr=[...de_tag];
					var tmpBalDiv = document.createElement('div');
					document.getElementsByTagName("body")[0].appendChild(tmpBalDiv);
					tmpBalDiv.className = 'balance-text';
					tmpBalDiv.innerHTML = de_tag;
					tmpBalDiv.style.cssText = subsStyl + " " + subsStylTwo + "text-align:center; visibility:hidden;";
					balanceText(tmpBalDiv);
					var split_pattern= [].slice.call(tmpBalDiv.innerHTML.split('<br data-owner="balance-text">'));
					var pos_flag=0;
					var out_tag_cnt=0;
					var out_tag_cnt2=0;
					var dtg  =0;
					subtitleCurr[k]='';
					for (let n=0; n<spread.length; n++){
						if(n==line_tags[1][pos_flag]){
						subtitleCurr[k]+=line_tags[0][pos_flag];
						n=line_tags[2][pos_flag];
						pos_flag++;
						}else{
						if((typeof split_pattern[out_tag_cnt]==='undefined')||(out_tag_cnt2<split_pattern[out_tag_cnt].length)){
						subtitleCurr[k]+=de_tag_spr[dtg];
						dtg++;
						out_tag_cnt2++;
						}else{
						subtitleCurr[k]+='\n';
						out_tag_cnt2=0;
						out_tag_cnt++;
						n--;
						}
						}
					}
					tmpBalDiv.remove();
				}
				self.s_.track.track.cues[i].text = subtitleCurr.join('\n');
			}
			self.s_.track.track.mode = "showing";
			self.s_.blcd = 1;

		}
	}
	}
		
	vController.vidControl.prototype.showLink = function(){		
				switch (this.lkButnStatus_)
		{

			case 0:
				this.lnk_.dom.value = getSrc(this.videoEl_);
				this.lnk_.dom.readOnly = true;
				this.lnk_.dom.style.maxWidth=Math.abs(this.videoEl_.clientWidth-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('margin-left'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('margin-right'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('padding-left'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('padding-right'))-this.el_.clientWidth)+'px';
				this.linkButton_.parentNode.insertBefore(this.lnk_.dom, this.linkButton_.nextSibling);

				this.lnk_.dom.style.width = this.lnk_.dom.value.length + "ch";
				this.lnk_.dom.style.display = 'initial';

				this.lnk_.dom.select();
				
				this.lkButnStatus_=1;
			break;
			case 1:
				this.lnk_.dom.style.display = 'none';
				this.lkButnStatus_=2;
			break;
			case 2:
			let new_src=getSrc(this.videoEl_);
				if(this.lnk_.dom.value!=new_src){
				this.lnk_.dom.readOnly = false;
				this.lnk_.dom.value = new_src;
				this.lnk_.dom.readOnly = true;
				}
				this.lnk_.dom.style.maxWidth=getMax(this.lnk_.dom.style.maxWidth,Math.abs(this.videoEl_.clientWidth-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('margin-left'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('margin-right'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('padding-left'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('padding-right'))-this.el_.clientWidth))	+'px';
				this.lnk_.dom.style.width = this.lnk_.dom.value.length + "ch";
				this.lnk_.dom.style.display = 'initial';
				this.lnk_.dom.select();
				this.lkButnStatus_=1;
			break;
		}
		
	}
	
	vController.vidControl.prototype.doSubs = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);

		function colour_subs(str)
		{
			let colStyls = [];
			var op = str.match(/<([\\n]|\s)*font((\\n)*\s{1}|\s{1}|\s{1}(\\n)*|(\\n)*\s{1}(\\n)*)*color([\\n]|\s)*=([\\n]|\s)*[^>]+>/g);
			if (op !== null)
			{
				var cl = str.match(/<([\\n]|\s)*\/([\\n]|\s)*font{1}([\\n]|\s)*>/g);
				var cols = [];
				
				for (let i = 0; i < op.length; i++)
				{
					cols.push(op[i].match(/={1}[^>]+/g)[0].split(' ').join('').split('\n').join('').split('=').join('').split('"').join(''));
					str = str.split(op[i]).join('<c.col_' + cols[i].split('#').join('') + '>');
					
					colStyls.push(' ::cue(c.col_' + cols[i].split('#').join('') + '){color: ' + cols[i] + ';}');

				}
				let finalColStyls = Array.from(new Set(colStyls));

				for (let k = 0; k < finalColStyls.length; k++)
				{
					subsCSS.innerHTML += finalColStyls[k];
				}

				for (let i = 0; i < cl.length; i++)
				{
					str = str.split(cl[i]).join('</c>');
				}
			}
			return str;
		}

		function srtVttTiming(srt)
		{

			var tm = srt.match(/\d+\n{1}\d{2,}:\d{2}:\d{2},\d{3} --> \d{2,}:\d{2}:\d{2},\d{3}/g);
			var nTm = [];
			for (let i = 0; i < tm.length; i++)
			{
				nTm.push(tm[i].split('\n')[1].split(',').join('.'));
				srt = srt.split(tm[i]).join(nTm[i]);
			}

			return srt;
		}
			
		thisSub = this;
		
		switch (thisSub.subButnStatus_)
		{
			
			case null:


				thisSub.subti_.dom = document.createElement('textarea');

				thisSub.subsButton_.parentNode.insertBefore(thisSub.subti_.dom, thisSub.subsButton_.nextSibling);

				thisSub.subti_.dom.id = "subti";

				thisSub.openSRT_ = document.createElement('input');
				thisSub.openSRT_.type = "file";
				thisSub.openSRT_.accept = ".srt,.vtt";
				thisSub.subti_.dom.parentNode.insertBefore(thisSub.openSRT_, thisSub.subti_.dom.nextSibling);

				thisSub.openSRT_.onchange = function(){
					
					var fr = new FileReader();
					fr.onload = function()
					{
						thisSub.subti_.dom.value = this.result;
					}
					
					thisSub.is_vtt_=(this.files[0].name.endsWith('.vtt'))?true:false;
					fr.readAsText(this.files[0]);
					
				}

				thisSub.subButnStatus_ = 0;
				break;

			case 0:
				if (thisSub.subti_.dom.value == "")
				{
					thisSub.subti_.dom.style.display = "none";
					thisSub.openSRT_.style.display = "none";
					thisSub.subButnStatus_ = 2;

				}
				else
				{

						thisSub.s_.track = document.createElement('track');

						thisSub.videoEl_.appendChild(thisSub.s_.track);

						console.log(thisSub.s_.track);
						subsCSS = document.createElement("style");

						subsCSS.type = "text/css";
						thisSub.s_.track.id = "subs1";
						
						if(!thisSub.is_vtt_){
							thisSub.s_.vtt = 'WEBVTT\n\n' + thisSub.subti_.dom.value;
							subsCSS.innerHTML = "::cue {" + subsStyl + "} ::-webkit-media-text-track-display {" + subsStylTwo + "}";

							thisSub.s_.vtt = colour_subs(thisSub.s_.vtt);
							thisSub.s_.vtt = srtVttTiming(thisSub.s_.vtt);
					}else{
						thisSub.s_.vtt = thisSub.subti_.dom.value;
					}
					
					hed.appendChild(subsCSS);
					
					thisSub.s_.track.src = vttURL(thisSub.s_.vtt);
					thisSub.s_.track.track.mode = "showing";

					thisSub.subti_.dom.style.display = "none";
					thisSub.openSRT_.style.display = "none";
					thisSub.subsButton_.textContent = '‗';

					//console.log('subs loaded!');

					thisSub.s_.delIndicator = document.createElement('span');
					thisSub.s_.delIndicator.style.marginLeft = '5px';
					thisSub.s_.delIndicator.style.marginRight = '5px';
					thisSub.s_.delIndicator.textContent = ' ms';
					thisSub.openSRT_.parentNode.insertBefore(thisSub.s_.delIndicator, thisSub.subsButton_.nextSibling);

					thisSub.s_.track.oncuechange= function(){

						if ((thisSub.s_.origTrack == 0 || thisSub.s_.origTrack.text.length<thisSub.s_.track.track.cues.length) && (thisSub.s_.track!=0))
						{
							balanceSubs(thisSub);

							var stTm = [];
							var edTm = [];
							var tTxt = [];

							for (let m = 0; m < thisSub.s_.track.track.cues.length; m++)
							{
								stTm[m] = thisSub.s_.track.track.cues[m].startTime;
								edTm[m] = thisSub.s_.track.track.cues[m].endTime;
								tTxt[m] = thisSub.s_.track.track.cues[m].text;
							}

							thisSub.s_.origTrack = {
								"start": stTm,
								"end": edTm,
								"text": tTxt
							};
							thisSub.s_.delIndicator.textContent="0 ms";
							
							thisSub.videoEl_.play();
							
							console.log("HTML5 media speed controller:\nReference track created!\nYou can set the subtitles' delay now!");
							
						}
					}

				thisSub.subsButton_.style.backgroundColor = "#36ff07";
				thisSub.subButnStatus_ = 1;
				}
				break;

			case 1:

				thisSub.subti_.dom.style.display = "initial";
				thisSub.openSRT_.style.display = "initial";

				thisSub.subsButton_.textContent = '_';
				thisSub.s_.origTrack = 0;

				let tracks = getMatchingNodesShadow(document,'TRACK',true,false);
				for (let i = 0; i < tracks.length; i++)
				{
					if (tracks[i].src = thisSub.s_.track.src)
					{
						tracks[i].remove();
					}
				}
				thisSub.s_.delIndicator.style.display = "none";
				thisSub.s_.delIndicator.textContent = '0 ms';
				thisSub.s_.track = 0;
				thisSub.subsButton_.style.backgroundColor = "white";
				thisSub.s_.d = 0;
				thisSub.s_.blcd = 0;
				subsCSS.innerHTML = '';
				thisSub.subButnStatus_ = 2;
				break;

			case 2:
				thisSub.subti_.dom.style.display = "initial";
				thisSub.openSRT_.style.display = "initial";
				thisSub.subButnStatus_ = 0;
				break;

			case 3:
				thisSub.s_.track.track.mode = "showing";
				thisSub.subsButton_.style.backgroundColor = "#36ff07";
				thisSub.subButnStatus_ = 1;
				break;

		}

	}

	vController.vidControl.prototype.setSpeed = function(s)
	{
		this.hideControlTagNext=true;
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);
		this.videoEl_.playbackRate = s;
	};

	vController.vidControl.prototype.switchSpeed = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_, this);
		if (this.videoEl_.playbackRate != swtchTo)
		{
			pR1 = this.videoEl_.playbackRate;
			this.videoEl_.playbackRate = swtchTo;
		}
		else
		{
			this.videoEl_.playbackRate = pR1;
			pR1 = swtchTo;
		}

	};

	vController.vidControl.prototype.showHide = function()
	{
		if ((this.permashow_ == 0) && (this.permahide_ == 0))
		{
			this.el_.style.display = 'initial';
			this.el_.style.visibility = 'initial';
			this.el_.style.opacity = '0.78';
			this.permashow_ = 1;
			clearTimeout(disap);
			//c_hide(this.el_,this.bgEl_, this.videoEl_,this);
			if(this.isol_==1){
			console.log('HTML5 Video Speed Control: Perma-show active! - Video isolated.');
			}else{
			console.log('HTML5 Video Speed Control: Perma-show active!');
			}
		}
		else if ((this.permashow_ == 1) && (this.permahide_ == 0))
		{
			this.permashow_ = 0;
			this.permahide_ = 1;
			clearTimeout(disap);
			//	c_hide(this.el_,this.bgEl_, this.videoEl_, this);
			this.el_.style.display = 'none';
			this.el_.style.visibility = 'hidden';
			this.el_.style.opacity = '';
			if(this.isol_==1){
			console.log('HTML5 Video Speed Control: Perma-hide active! - Video isolated.');
			}else{
			console.log('HTML5 Video Speed Control: Perma-hide active!');
			}
		}
		else if ((this.permashow_ == 0) && (this.permahide_ == 1))
		{
			this.permahide_ = 0;
			this.isol_=(this.isol_==0)?1:0;
			if(this.isol_==1){
			let shds=getMatchingNodesShadow(document,false,true,true);
			let vInsts=vController.vidControl.instances.map((s)=>{return s.el_});
			shds=shds.filter((r)=>{return !vInsts.includes(r.root);})
			let shdows=[hed,...shds.map((n)=>{return n.root;})];
			let shdows_ch=[[...hed.children],...shds.map((n)=>{return n.childNodes;})];
			isolator_tags=[];

			for(let j=0, len_j=shdows.length; j<len_j; j++){
				try{
						let isolts=shdows_ch[j].filter((c)=>{return (c.nodeName==='STYLE' && c.innerHTML===isolator_HTML);});
						
						if(isolts.length>0){
								isolator_tags.push(...isolts);
						}else{
							let s=document.createElement('style');
							s.innerHTML=isolator_HTML;
							if(j===0){
								shdows[j].insertAdjacentElement('afterbegin',s);
							}else{
								shdows[j].shadowRoot.prepend(s);
							}
							isolator_tags.push(s);
						}
						
				}catch(e){;}
			}
			this.videoEl_.style.display = 'initial';
			this.videoEl_.style.visibility = 'initial';
			this.videoEl_.controls = true;
			c_hide(this.el_, this.bgEl_, this.videoEl_, this);
			console.log('HTML5 Video Speed Control: No permanence! - Video isolated.');
			}else{
			for(let j=0, len_j=isolator_tags.length; j<len_j; j++){
				let ij=isolator_tags[j];
				ij.innerHTML='';
				elRemover(ij);
			}
			this.videoEl_.controls=(this.videoEl_.getAttribute('def_ctrls')=='false')?false:true;
			c_hide(this.el_, this.bgEl_, this.videoEl_, this);
			this.el_.style.display = 'initial';
			this.el_.style.visibility = 'initial';
			this.el_.style.opacity = '';
			console.log('HTML5 Video Speed Control: No permanence!');
			}
			
		}else{
			return;
		}

	};

	vController.vidControl.prototype.handleKeyDown_ = function(e)
	{
		let pth=e.composedPath()[0];
		if ((pth.tagName == 'INPUT')||(pth.tagName == 'TEXTAREA')||(pth.isContentEditable))
		{
			if(this.bgEl_.contains(pth))
			{
			e.stopPropagation();
			}
			else
			{
			return;
			}
		}
		else
		{
			if (sets[3].s)
			{
				if (e.altKey)
				{

					switch (e.keyCode)
					{

						case 49:
						case 97:
						e.stopPropagation();
							if(e.shiftKey){
							this.setSpeed(11);	
							}else{
							this.setSpeed(1);
							}
							break;

						case 50:
						case 98:
						e.stopPropagation();
							if(e.shiftKey){
							this.setSpeed(12);	
							}else{
							this.setSpeed(2);
							}
							break;

						case 51:
						case 99:
						e.stopPropagation();
							if(e.shiftKey){
							this.setSpeed(13);	
							}else{
							this.setSpeed(3);
							}
							break;

						case 52:
						case 100:
						e.stopPropagation();
							if(e.shiftKey){
							this.setSpeed(14);	
							}else{
							this.setSpeed(4);
							}
							break;

						case 53:
						case 101:
						e.stopPropagation();
							if(e.shiftKey){
							this.setSpeed(15);	
							}else{
							this.setSpeed(5);
							}
							break;

						case 54:
						case 102:
						e.stopPropagation();
							if(e.shiftKey){
							this.setSpeed(16);	
							}else{
							this.setSpeed(6);
							}
							break;

						case 55:
						case 103:
						e.stopPropagation();
							if(!e.shiftKey){
							this.setSpeed(7);
							}
							break;

						case 56:
						case 104:
						e.stopPropagation();
							if(!e.shiftKey){
							this.setSpeed(8);
							}
							break;

						case 57:
						case 105:
						e.stopPropagation();
							if(!e.shiftKey){
							this.setSpeed(9);
							}
							break;

						case 48:
						case 96:
						e.stopPropagation();
							this.setSpeed(10);
							break;

					}
				}
			}

			if ((e.keyCode == 16) || (e.keyCode == 17) || (e.keyCode == 18))
			{
				return;
			}
			else
			{
				
				this.tmpScObj_ = {
					id: null,
					ctrl: null,
					alt: null,
					shift: null,
					code: null,
					dispKey: null,
					wheelDeltaX: null,
					wheelDeltaY: null
				};

				if (e.altKey)
				{
					this.tmpScObj_.alt = true;
				}
				if (e.ctrlKey)
				{
					this.tmpScObj_.ctrl = true;
				}

				if (e.shiftKey)
				{
					this.tmpScObj_.shift = true;
				}

				this.tmpScObj_.code = e.code;

				this.scCompareE_ = [this.tmpScObj_.alt, this.tmpScObj_.code, this.tmpScObj_.ctrl, this.tmpScObj_.shift];

				for (let i = 0; i <= 11; i++)
				{
					this.scCompareS_ = [objs[i].o.alt, objs[i].o.code, objs[i].o.ctrl, objs[i].o.shift];
					if (JSON.stringify(this.scCompareE_) === JSON.stringify(this.scCompareS_))
					{

						if (i == 0)
						{
							e.preventDefault();
							this.increaseSpeed();
						}

						if (i == 1)
						{
							e.preventDefault();
							this.decreaseSpeed();
						}

						if (i == 2)
						{
							e.preventDefault();
							this.switchSpeed();
						}

						if (i == 3)
						{
							e.preventDefault();
							this.goBack();
						}

						if (i == 4)
						{
							e.preventDefault();
							this.goForwards();
						}

						if (i == 5)
						{
							e.preventDefault();
							this.showHide();
						}

						if (i == 6)
						{
							e.preventDefault();
							this.s_.d += sDel;
							subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
						}

						if (i == 7)
						{
							e.preventDefault();
							this.s_.d -= sDel;
							subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
						}

						if (i == 8)
						{
							e.preventDefault();
							this.s_.d += sDelF;
							subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
						}

						if (i == 9)
						{
							e.preventDefault();
							this.s_.d -= sDelF;
							subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
						}

						if (i == 10)
						{
							e.preventDefault();
							this.s_.d += 1;
							subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
						}

						if (i == 11)
						{
							e.preventDefault();
							this.s_.d -= 1;
							subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
						}

					}
				}

				if (JSON.stringify(this.scCompareE_) === JSON.stringify([objs[12].o.alt, objs[12].o.code, objs[12].o.ctrl, objs[12].o.shift]))
				{
					e.preventDefault();
					subUpDwn(sMv * -1);

				}

				if (JSON.stringify(this.scCompareE_) === JSON.stringify([objs[13].o.alt, objs[13].o.code, objs[13].o.ctrl, objs[13].o.shift]))
				{
					e.preventDefault();
					subUpDwn(sMv * 1);

				}

				this.tmpScObj_ = {
					id: null,
					ctrl: null,
					alt: null,
					shift: null,
					code: null,
					dispKey: null,
					wheelDeltaX: null,
					wheelDeltaY: null
				};
				this.scCompareE_ = [];
				this.scCompareS_ = [];

			}

		}
	};

	vController.vidControl.prototype.handleFocus_ = function(e)
	{		
			if (e.target === this.lnk_.dom)
			{
			this.fc_hv_.lnk_fc=true;
			}
			if (e.target === this.subti_.dom)
			{
			this.fc_hv_.subti_fc=true;
			}

	};

	vController.vidControl.prototype.handleFocusOut_ = function(e)
	{
			if (e.target === this.lnk_.dom)
			{
			this.fc_hv_.lnk_fc=false;
			}
			if (e.target === this.subti_.dom)
			{
			this.fc_hv_.subti_fc=false;
			}

	};
	
	vController.vidControl.prototype.handleMouseOver_ = function(e)
	{
			this.fc_hv_.bar_hv=true;
			c_hide(this.el_, this.bgEl_, this.videoEl_, this);
	};	
	
	vController.vidControl.prototype.handleMouseOut_ = function(e)
	{
			this.fc_hv_.bar_hv=false;
			this.fc_hv_.lnk_fc=false;
			c_hide(this.el_, this.bgEl_, this.videoEl_, this);
	};

		vController.vidControl.prototype.handleMouseDown_ = function(e)
	{
		let pth=e.composedPath()[0];
		if (pth.tagName == 'INPUT' ||
			pth.tagName == 'TEXTAREA' ||
			pth.isContentEditable)
		{
				pth.offsetParent.draggable = false;
				return;
		}
		else
		{

			if (!ifAnyOf(pth,this.barButtonsArr_))
			{
				//e.preventDefault();
				e.stopPropagation();
				pth.offsetParent.draggable = true;
				this.el_.style.cursor = 'grabbing';
			}
		}
	};	

	vController.vidControl.prototype.handleMouseUp_ = function(e)
	{
				this.el_.style.cursor = 'initial';
	};		
	
	vController.vidControl.prototype.handleClick_ = function(e)
	{
		let pth=e.composedPath()[0];
		if (!(pth.tagName == 'INPUT' ||
			pth.tagName == 'TEXTAREA' ||
			pth.isContentEditable))
		{
			if (e.target === this.switchButton_)
			{				
				e.preventDefault();
				e.stopPropagation();
				this.switchSpeed();
			}
			else if (e.target === this.backButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.goBack();
			}
			else if (e.target === this.minusButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.decreaseSpeed();
			}
			else if (e.target === this.plusButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.increaseSpeed();
			}
			else if (e.target === this.forwardButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.goForwards();
			}
			else if (e.target === this.linkButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.showLink();
			}
			else if (e.target === this.subsButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.doSubs();
			}
			else if (e.target === this.closeButton_)
			{
				e.preventDefault();
				e.stopPropagation();
				this.permashow_ = 1;
				this.permahide_ = 0;
				this.fc_hv_.lnk_fc=false;
				this.fc_hv_.subti_fc=false;
				this.fc_hv_.bar_hv=false;
				this.showHide();
			}

		}
	};

	vController.vidControl.prototype.handleWheel_ = function(e)
	{
		let pth=e.composedPath()[0];
		if (!(pth.tagName == 'INPUT' ||
			pth.tagName == 'TEXTAREA' ||
			pth.isContentEditable))

		{

			this.tmpScObj_ = {
				id: null,
				ctrl: null,
				alt: null,
				shift: null,
				code: null,
				dispKey: null,
				wheelDeltaX: null,
				wheelDeltaY: null
			};

			this.tmpScObj_.wheelDeltaX = e.deltaX / Math.abs(e.deltaX);
			this.tmpScObj_.wheelDeltaY = e.deltaY / Math.abs(e.deltaY);
			if (e.altKey)
			{
				this.tmpScObj_.alt = true;
			}
			if (e.ctrlKey)
			{
				this.tmpScObj_.ctrl = true;
			}

			if (e.shiftKey)
			{
				this.tmpScObj_.shift = true;
			}

			this.scCompareE_ = [this.tmpScObj_.alt, this.tmpScObj_.ctrl, this.tmpScObj_.shift, this.tmpScObj_.wheelDeltaX, this.tmpScObj_.wheelDeltaY];

			for (let i = 0; i <= 11; i++)
			{
				this.scCompareS_ = [objs[i].o.alt, objs[i].o.ctrl, objs[i].o.shift, objs[i].o.wheelDeltaX, objs[i].o.wheelDeltaY];
				if (JSON.stringify(this.scCompareE_) === JSON.stringify(this.scCompareS_))
				{

					if (i == 0)
					{
						e.preventDefault();
						this.increaseSpeed();
					}

					if (i == 1)
					{
						e.preventDefault();
						this.decreaseSpeed();
					}

					if (i == 2)
					{
						e.preventDefault();
						this.switchSpeed();
					}

					if (i == 3)
					{
						e.preventDefault();
						this.goBack();
					}

					if (i == 4)
					{
						e.preventDefault();
						this.goForwards();
					}

					if (i == 5)
					{
						e.preventDefault();
						this.showHide();
					}

					if (i == 6)
					{
						e.preventDefault();
						this.s_.d += sDel;
						subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
					}

					if (i == 7)
					{
						e.preventDefault();
						this.s_.d -= sDel;
						subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
					}

					if (i == 8)
					{
						e.preventDefault();
						this.s_.d += sDelF;
						subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
					}

					if (i == 9)
					{
						e.preventDefault();
						this.s_.d -= sDelF;
						subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
					}

					if (i == 10)
					{
						e.preventDefault();
						this.s_.d += 1;
						subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
					}

					if (i == 11)
					{
						e.preventDefault();
						this.s_.d -= 1;
						subsDelay(this.s_.track, this.s_.origTrack, this.s_.d, this.videoEl_, this.el_, this.bgEl_, this);
					}

				}
			}

			if (JSON.stringify(this.scCompareE_) === JSON.stringify([objs[12].o.alt, objs[12].o.code, objs[12].o.ctrl, objs[12].o.shift]))
			{
				e.preventDefault();
				subUpDwn(-1 * sMv);
			}

			if (JSON.stringify(this.scCompareE_) === JSON.stringify([objs[13].o.alt, objs[13].o.code, objs[13].o.ctrl, objs[13].o.shift]))
			{
				e.preventDefault();
				subUpDwn(1 * sMv);
			}

			if (sets[0].s)
			{

				if (e.deltaY < 0)
				{
					e.preventDefault();
					this.increaseSpeed();
				}
				else if (e.deltaY > 0)
				{
					e.preventDefault();
					this.decreaseSpeed();
				}
				else
				{
					return;
				}
			}

			this.tmpScObj_ = {
				id: null,
				ctrl: null,
				alt: null,
				shift: null,
				code: null,
				dispKey: null,
				wheelDeltaX: null,
				wheelDeltaY: null
			};
			this.scCompareE_ = [];
			this.scCompareS_ = [];

		}
	};

	vController.vidControl.prototype.handleDblClick_ = function(e) {
			let pth=e.composedPath()[0];
			if (pth.tagName == 'INPUT' ||
			pth.tagName == 'TEXTAREA' ||
			pth.isContentEditable)
		{
			if (this.bgEl_.contains(pth))
			{
				pth.select();
			}
			else
			{
				return;
			}
		}
		else
		{
			e.preventDefault();
			e.stopPropagation();
			
			if(!ifAnyOf(e.target,this.barButtonsArr_))
			{
				this.el_.style.transform = `translate(0px, 0px)`;
				this.el_.setAttribute('baseX',0);
				this.el_.setAttribute('baseY',0);
			}
		}

	};

	vController.vidControl.prototype.handleDragStartEvent_ = function(e)
	{
		this.el_.style.cursor = 'grabbing';
		this.el_.setAttribute('dragStartX',e.layerX);
		this.el_.setAttribute('dragStartY',e.layerY);
	};	
	vController.vidControl.prototype.handleDragEndEvent_ = function(e)
	{
		this.el_.style.cursor = 'initial';
		
		let leftPosition=getMax(0,parseFloat(this.el_.getAttribute('baseX'))+e.layerX-parseFloat(this.el_.getAttribute('dragStartX')));
		let topPosition=getMax(0,parseFloat(this.el_.getAttribute('baseY'))+e.layerY-parseFloat(this.el_.getAttribute('dragStartY')));
		
		this.el_.setAttribute('baseX',leftPosition);
		this.el_.setAttribute('baseY',topPosition);

		this.el_.style.transform = `translate(${leftPosition}px,${topPosition}px)`;
	};

	vController.vidControl.prototype.getSpeed = function()
	{
		return parseFloat(this.videoEl_.playbackRate.toLocaleString('en-GB',
		{
			minimumFractionDigits: 2,
			maximumFractionDigits: 7
		}));
	};

	let rem = "0:00:00";

function timeAhead(video){
				let c_i=video.currentTime;
				var rgs=[];
			for (let k=video.buffered.length-1; k>=0; k--){
			let t_i=video.buffered.end(k);
			let s_i=video.buffered.start(k);
				if(c_i>=s_i && t_i>=c_i){
					rgs.push([s_i,t_i]);
				}
			}
			
			var tot=0;
			if(rgs.length>0){
			let sorted=rgs.sort((a, b) => {return a[0] - b[0];})
			tot=sorted[0][1]-c_i;
			for (let k=1; k<sorted.length; k++){
				if(sorted[k-1][1]==sorted[k][0]){
					tot+=sorted[k][1]-sorted[k][0];
				}else{
					break;
				}
			}
			}
			
					return cd_s_hmmss((video.playbackRate==0)?0:tot/video.playbackRate,true);

}


	function cd_s_hmmss(s,rndD)
	{

		var ss = "00";
		var mm = "00";
		var hh = "";

		var hours = getMax(0,Math.floor(Math.ceil(s) / 3600));
		if (hours > 0)
		{
			hh = hours + ":";
		}

		var mins = getMax(0,Math.floor((Math.ceil(s) - hours * 3600) / 60));

		if (mins < 10)
		{
			mm = "0" + mins;
		}
		else
		{
			mm = mins;
		}
		var secs = (rndD)?getMax(0,Math.floor(s - hours * 3600 - mins * 60)):getMax(0,Math.ceil(s - hours * 3600 - mins * 60));

		if (secs < 10)
		{
			ss = "0" + secs;
		}
		else
		{
			ss = secs;
		}

		return hh + mm + ":" + ss;
	}

	vController.vidControl.prototype.rmng = function()
	{

			let new_src=getSrc(this.videoEl_);
				if(this.lnk_.dom.value!=new_src){
				this.videoEl_.playbackRate=1;
				if(this.lkButnStatus_==1){
				this.lnk_.dom.readOnly = false;
				this.lnk_.dom.value = new_src;
				this.lnk_.dom.readOnly = true;
				this.lnk_.dom.style.maxWidth=getMax(this.lnk_.dom.style.maxWidth,Math.abs(this.videoEl_.clientWidth-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('margin-left'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('margin-right'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('padding-left'))-parseFloat(window.getComputedStyle(this.el_, null).getPropertyValue('padding-right'))-this.el_.clientWidth))	+'px';
				this.lnk_.dom.style.width = this.lnk_.dom.value.length + "ch";
				this.switchButton_.textContent = this.swtch();
				this.lnk_.dom.select();
				}else{
				this.switchButton_.textContent = this.swtch();
				}
		}
		let speed = this.videoEl_.playbackRate;
		if (speed!=0){
		if(!isFinite(this.videoEl_.duration)){
			return speed.toLocaleString('en-GB',
				{
					minimumFractionDigits: 2,
					maximumFractionDigits: 7
				}) + " | " + timeAhead(this.videoEl_);
		}else{
		rem = (this.videoEl_.duration - this.videoEl_.currentTime) / this.videoEl_.playbackRate;
		rem = cd_s_hmmss(rem,false);
		return speed.toLocaleString('en-GB',
		{
			minimumFractionDigits: 2,
			maximumFractionDigits: 7
		}) + " | " + rem;
		}
		}else{
			return "0.00";
		}
	}

	vController.vidControl.prototype.swtch = function()
	{
		let speed = this.videoEl_.playbackRate;
		if(pR1 == speed){
		return swtchTo + 'x';
		}else{
		if(!!isFinite(speed)){

			if (speed != swtchTo)
			{
				return speed.toLocaleString('en-GB',
				{
					minimumFractionDigits: 0,
					maximumFractionDigits: 7
				}) + 'x/' + swtchTo + 'x';
			}
			else
			{
				return swtchTo + "x/" + pR1.toLocaleString('en-GB',
				{
					minimumFractionDigits: 0,
					maximumFractionDigits: 7
				}) + "x";
			}
	
	}else{
		return swtchTo + 'x';
	}
	}
	}

	vController.vidControl.insertAll = function()
	{
		var videoTags = [
			...getMatchingNodesShadow(document,'VIDEO',true,false),
			...getMatchingNodesShadow(document,'AUDIO',true,false)
		];

	if(vController.vidControl.instances.length>0){
		vController.vidControl.instances.forEach(function(instance) {
			var clnChk=0;
			
			for(let i=0;i<videoTags.length;i++){
				if(instance.videoEl_!==videoTags[i]){
					clnChk=0;
				}else{
					clnChk=1;
					i=videoTags.length;
				}
			}
		
		if(clnChk==0){
			elRemover(instance.el_);
			vController.vidControl.instances=removeEls(instance,vController.vidControl.instances);
			}
		
		});
	}

		Array.prototype.forEach.call(videoTags, function(videoTag)
		{
			if (eligVid(videoTag))
			{
				if (!videoTag.getAttribute('vController-video-control'))
				{
					videoTag.setAttribute('vController-video-control', true);
					new vController.vidControl(videoTag);
				}
			}
		});
	};

	if(typeof observer ==="undefined" && typeof timer ==="undefined"){
			var timer;
			var timer_tm=null;
		const observer = new MutationObserver((mutations) =>
		{
			if(timer){
				clearTimeout(timer);
				if(performance.now()-timer_tm>=1350){
					vController.vidControl.insertAll();
					timer_tm=performance.now();
				}
			}
			
			timer = setTimeout(() =>
			{
				vController.vidControl.insertAll();
				timer_tm=performance.now();
			}, 150);
			
			if(timer_tm ===null){
				timer_tm=performance.now();
			}
		});

		observer.observe(document,
		{
			attributes: true,
			childList: true,
			subtree: true
		});
	}
}