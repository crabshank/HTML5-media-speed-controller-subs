var vController = vController || {};

let defOpacity;
var openSRT;
let subti = {
	dom: 0
};

let s = {
	track: 0,
	origTrack: 0,
	vtt: 0,
	d: 0,
	delIndicator: 0,
	blcd: 0
};

var tmpScObj = {
	id: null,
	ctrl: null,
	alt: null,
	shift: null,
	code: null,
	dispKey: null,
	wheelDeltaX: null,
	wheelDeltaY: null
};

var scCompareS = [];
var scCompareE = [];

s.vtt = "WEBVTT\n\n00:00:00.000 --> 9999:59:59.999\n"

function vttURL(t)
{
	let textFileAsBlob = new Blob([t],
	{
		type: 'text/vtt'
	});
	return window.URL.createObjectURL(textFileAsBlob);
}

function blacklistMatch(array, t)
{
	var notFound = false;
	if ((array.length == 1 && array[0] == "") || (array.length == 0))
	{
		return false
	}
	else
	{

		var track = null;
		for (let i = 0; i < array.length; i++)
		{

			let b = removeEls("", array[i].split('*'));
			for (let k = 0; k < b.length; k++)
			{
				let pos = t.toLocaleLowerCase().indexOf(b[k].toLocaleLowerCase()); //full, then part
				if (pos >= track)
				{
					track = pos;
				}
				else
				{
					if (i == array.length - 1 && k == b.length - 1 && track == null)
					{
						notFound = true;
					}
				}
			}

		}
		if (notFound)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
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

var permashow = 0;
var permahide = 0;

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
			console.log(items);
			objs = items.scObjs;
			sets = items.settgs

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
			restore_options();
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
		"s": 264
	},
	{
		"n": "subsStyl",
		"s": "background-color: transparent;\ncolor: #ffff00;\nfont-size: 192%;\nfont-weight: bold;\ntext-shadow: 1px 4px black, 6px 2px black, -7px -1px black, 7px 4px black;\nfont-family: Segoe UI;"
	},
	{
		"n": "videoCSS",
		"s": "brightness(1)\ncontrast(1)\nsaturate(1)\nhue-rotate(0deg)\ninvert(0)\nsepia(0)\nblur(0px);"
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
	}]

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

		if (!isCurrentSiteBlacklisted())
		{

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

					this.videoEl_.style.cssText = this.videoEl_.style.cssText + ' filter: url("#filter-sample");';

				}

			}
			else
			{

				if (vidCSS)
				{

					this.videoEl_.style.cssText = this.videoEl_.style.cssText + ' filter: ' + videoCSS;

				}

			}

			this.createDom();
			this.enterDocument();
			vController.vidControl.instances.push(this);
			console.log(vController.vidControl.instances);
		}
		else
		{
			console.warn('Current site is blacklisted from speed controller.');
		}
	};

	vController.vidControl.CLASS_NAME = 'vController-video-control';

	vController.vidControl.instances = [];

	vController.vidControl.deleteAll = function()
	{
		vController.vidControl.instances.forEach((instance) => instance.delete());
		vController.vidControl.instances = [];
	}
	
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
		var subsButton = document.createElement('button');
		var closeButton = document.createElement('button');
		shadow.appendChild(bg);
		bg.appendChild(speedIndicator);
		bg.appendChild(switchButton);
		bg.appendChild(backButton);
		bg.appendChild(minusButton);
		bg.appendChild(plusButton);
		bg.appendChild(forwardButton);
		bg.appendChild(subsButton);
		bg.appendChild(closeButton);
		bg.classList.add('vController-bg');
		speedIndicator.classList.add('speed-indicator');
		switchButton.classList.add('vController-btn', 'switcher');
		backButton.textContent = '↶';
		backButton.classList.add('vController-btn', 'back');
		minusButton.textContent = '-';
		minusButton.classList.add('vController-btn', 'decrease');
		plusButton.textContent = '+';
		plusButton.classList.add('vController-btn', 'increase');
		forwardButton.textContent = '↷';
		forwardButton.classList.add('vController-btn', 'forwards');
		subsButton.textContent = '_';
		subsButton.classList.add('vController-btn', 'subs');

		closeButton.classList.add('vController-btn', 'vController-close-button');
		closeButton.textContent = '🗙';

		this.videoEl_.parentElement.insertBefore(container, this.videoEl_);

		this.videoEl_.classList.add('vController-video');
		this.el_ = container;
		this.el_.classList.add(vController.vidControl.CLASS_NAME);
		this.bgEl_ = bg;
		this.speedIndicator_ = speedIndicator;
		this.switchButton_ = switchButton;
		this.backButton_ = backButton;
		this.minusButton_ = minusButton;
		this.plusButton_ = plusButton;
		this.forwardButton_ = forwardButton;
		this.subsButton_ = subsButton;
		this.closeButton_ = closeButton;

		defOpacity = this.el_.style.opacity;
	};

	var hideMulti = 0;
	var disap;

	function c_hide(c, d, v)
	{

		function showHide()
		{

			function shwHde(t)
			{
				hideMulti++;

				c.style.display = 'initial';

				if ((hvrChk() == false) && (permashow !== 1))
				{
					disap = setTimeout(hideCtl, t);
				}

				function hideCtl()
				{
					c.style.display = 'none';
					hideMulti = 0;
				}
			}
			if (hideMulti == 0)
			{
				shwHde(3000);
			}
			else
			{
				clearTimeout(disap);
				shwHde(3000);
			}
		}

		function hvrChk()
		{

			if ((c.matches(':hover')) || ((d.children.subti !== undefined) && (d.children.subti.matches(':focus'))))
			{

				return true;
			}
			else
			{
				return false;
			}
		}

		showHide();

		v.onmousemove = function()
		{

			showHide();

		}

	}

	vController.vidControl.prototype.enterDocument = function()
	{
		const self = this;
		var mouseDownHandler = this.handleMouseDown_.bind(this);
		var wheelHandler = this.handleWheel_.bind(this);
		//var dblClickHandler = this.handleDblClick_.bind(this);
		var keydownHandler = this.handleKeyDown_.bind(this);

		var dragHandler = this.handleDragEndEvent_.bind(this);
		this.bgEl_.addEventListener('mousedown', mouseDownHandler, true);
		// this.bgEl_.addEventListener('dblclick', dblClickHandler, true);
		this.bgEl_.addEventListener('mousewheel', wheelHandler, true);
		document.body.addEventListener('keydown', keydownHandler, true);

		document.body.addEventListener('dragend', dragHandler, true);
		this.el_.setAttribute('draggable', true);

		this.speedIndicator_.textContent = this.rmng();
		this.switchButton_.textContent = this.swtch();

		this.videoEl_.addEventListener('ratechange', function()
		{
			self.speedIndicator_.textContent = self.rmng();
			self.switchButton_.textContent = self.swtch();
		});
		this.videoEl_.addEventListener('timeupdate', function()
		{
			self.speedIndicator_.textContent = self.rmng();
			if (s.track !== 0)
			{
				if (s.track.track.mode == "showing")
				{
					self.subsButton_.style.backgroundColor = "#36ff07";
					subButnStatus = 1;
				}

				if (s.track.track.mode == "hidden")
				{
					self.subsButton_.style.backgroundColor = "#ff57ff";
					subButnStatus = 3;
				}
				if (s.track.track.mode == "disabled")
				{
					self.subsButton_.style.backgroundColor = "#c00000";
					subButnStatus = 3;
				}
			}
		});

		this.videoEl_.addEventListener('mouseenter', c_hide(this.el_, this.bgEl_, this.videoEl_), true);
	};

	vController.vidControl.prototype.goBack = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);
		this.videoEl_.currentTime -= sIncrement;
	};

	vController.vidControl.prototype.decreaseSpeed = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);
		this.videoEl_.playbackRate -= pRIncrement;
	};

	vController.vidControl.prototype.increaseSpeed = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);
		this.videoEl_.playbackRate += pRIncrement;
	};

	vController.vidControl.prototype.goForwards = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);
		this.videoEl_.currentTime += sIncrement;
	};

	var subButnStatus = null;
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

	}

	function subsDelay(track, origTrack, d, v, elm, bgElm)
	{

		function do_del()
		{
			c_hide(elm, bgElm, v);

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
			s.delIndicator.textContent = d + ' ms';

		}

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

	function balanceSubs()
	{
		if (s.blcd !== 1)
		{
			s.track.track.mode = "hidden";
			for (let i = 0; i < s.track.track.cues.length; i++)
			{
				var subtitleCurr = s.track.track.cues[i].text.split('\n');
				for (let k=0; k<subtitleCurr.length;k++){
					var tmpBalDiv = document.createElement('div');
					document.getElementsByTagName("body")[0].appendChild(tmpBalDiv);
					tmpBalDiv.className = 'balance-text';
					tmpBalDiv.style = subsStyl + " " + subsStylTwo + "text-align:center;";
					tmpBalDiv.innerHTML = subtitleCurr[k];
					balanceText(tmpBalDiv);
					subtitleCurr[k]= tmpBalDiv.innerHTML;
					tmpBalDiv.remove();
				}
				s.track.track.cues[i].text = subtitleCurr.join('\n').split('<br data-owner="balance-text">').join('\n');
			}
			s.track.track.mode = "showing";
			s.blcd = 1;

		}

	}

	vController.vidControl.prototype.doSubs = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);

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
					
					colStyls.push(' ::cue(c.col_' + cols[i].split('#').join('') + '){color: ' + cols[i] + ';}')

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

			var tm = srt.match(/\d+\n{1}\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/g);
			var nTm = [];
			for (let i = 0; i < tm.length; i++)
			{
				nTm.push(tm[i].split('\n')[1].split(',').join('.'));
				srt = srt.split(tm[i]).join(nTm[i]);
			}

			return srt;
		}

		switch (subButnStatus)
		{

			case null:

				thisSub = this;

				subti.dom = document.createElement('textarea');

				thisSub.subsButton_.parentNode.insertBefore(subti.dom, thisSub.subsButton_.nextSibling);

				subti.dom.id = "subti";

				openSRT = document.createElement('input');
				openSRT.type = "file";
				openSRT.accept = ".srt";
				subti.dom.parentNode.insertBefore(openSRT, subti.dom.nextSibling);

				openSRT.addEventListener('change', function()
				{
					var fr = new FileReader();
					fr.onload = function()
					{
						subti.dom.value = this.result;
					}

					fr.readAsText(this.files[0]);

				})

				subButnStatus = 0;
				break;

			case 0:
				if (subti.dom.value == "")
				{
					subti.dom.style.display = "none";
					openSRT.style.display = "none";
					subButnStatus = 2;

				}
				else
				{

					s.track = document.createElement('track');

					this.videoEl_.appendChild(s.track);

					s.vtt = 'WEBVTT\n\n' + subti.dom.value;

					thisSub.videoEl_.play();
					console.log(s.track);
					subsCSS = document.createElement("style");

					subsCSS.type = "text/css";
					subsCSS.innerHTML = "::cue {" + subsStyl + "} ::-webkit-media-text-track-display {" + subsStylTwo + "}";
					document.getElementsByTagName("head")[0].appendChild(subsCSS);

					s.track.id = "subs1";
					s.vtt = colour_subs(s.vtt);
					s.vtt = srtVttTiming(s.vtt);
					//console.log(s.vtt);

					s.track.src = vttURL(s.vtt);
					s.track.track.mode = "showing";

					subti.dom.style.display = "none";
					openSRT.style.display = "none";
					thisSub.subsButton_.textContent = '‗';

					//console.log('subs loaded!');

					s.delIndicator = document.createElement('span');
					s.delIndicator.style.marginLeft = '5px';
					s.delIndicator.style.marginRight = '5px';
					s.delIndicator.textContent = ' ms';
					openSRT.parentNode.insertBefore(s.delIndicator, thisSub.subsButton_.nextSibling);

					s.track.addEventListener("cuechange", function()
					{

						if (s.origTrack == 0)
						{
							balanceSubs();

							var stTm = [];
							var edTm = [];
							var tTxt = [];

							for (let m = 0; m < s.track.track.cues.length; m++)
							{
								stTm[m] = s.track.track.cues[m].startTime;
								edTm[m] = s.track.track.cues[m].endTime;
								tTxt[m] = s.track.track.cues[m].text;
							}

							s.origTrack = {
								"start": stTm,
								"end": edTm,
								"text": tTxt
							};
							s.delIndicator.textContent="0 ms";
							console.log("HTML5 media speed controller:\nReference track created!\nYou can set the subtitles' delay now!");
							
						}
					}, false)

				
				this.subsButton_.style.backgroundColor = "#36ff07";
				subButnStatus = 1;
				}
				break;

			case 1:

				subti.dom.style.display = "initial";
				openSRT.style.display = "initial";

				thisSub.subsButton_.textContent = '_';
				s.origTrack = 0;

				let tracks = document.getElementsByTagName('TRACK');
				for (let i = 0; i < tracks.length; i++)
				{
					if (tracks[i].src = s.track.src)
					{
						tracks[i].remove();
					}
				}
				s.delIndicator.style.display = "none";
				s.delIndicator.textContent = '0 ms';
				s.track = 0;
				this.subsButton_.style.backgroundColor = "white";
				s.d = 0;
				s.blcd = 0;

				subsCSS.innerHTML = '';
				subButnStatus = 2;
				break;

			case 2:
				subti.dom.style.display = "initial";
				openSRT.style.display = "initial";
				subButnStatus = 0;
				break;

			case 3:
				s.track.track.mode = "showing";
				this.subsButton_.style.backgroundColor = "#36ff07";
				subButnStatus = 1;
				break;

		}

	}

	vController.vidControl.prototype.setSpeed = function(s)
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);
		this.videoEl_.playbackRate = s;
	};

	vController.vidControl.prototype.switchSpeed = function()
	{
		c_hide(this.el_, this.bgEl_, this.videoEl_);
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
		if ((permashow == 0) && (permahide == 0))
		{
			this.el_.style.display = 'initial';
			this.el_.style.opacity = '0.78';
			permashow = 1;
			clearTimeout(disap);
			//c_hide(this.el_,this.bgEl_, this.videoEl_);
			console.log('Perma-show active!');
		}
		else if ((permashow == 1) && (permahide == 0))
		{
			permashow = 0;
			permahide = 1;
			clearTimeout(disap);
			//	c_hide(this.el_,this.bgEl_, this.videoEl_);
			this.el_.style.display = 'none';
			this.el_.style.opacity = '';

			console.log('Perma-hide active!');
		}
		else if ((permashow == 0) && (permahide == 1))
		{
			permahide = 0;
			c_hide(this.el_, this.bgEl_, this.videoEl_);
			this.el_.style.display = 'initial';
			this.el_.style.opacity = '';
			console.log('No permanence!');
		}
		else
		{
			return;
		}
	};

	vController.vidControl.prototype.handleKeyDown_ = function(e)
	{
		
		if ((e.path[0].tagName == 'INPUT')||(e.path[0].tagName == 'TEXTAREA')||(e.path[0].isContentEditable))
		{
			if(this.bgEl_.contains(e.path[0]))
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
							this.setSpeed(1);
							break;

						case 50:
						case 98:
						e.stopPropagation();
							this.setSpeed(2);
							break;

						case 51:
						case 99:
						e.stopPropagation();
							this.setSpeed(3);
							break;

						case 52:
						case 100:
						e.stopPropagation();
							this.setSpeed(4);
							break;

						case 53:
						case 101:
						e.stopPropagation();
							this.setSpeed(5);
							break;

						case 54:
						case 102:
						e.stopPropagation();
							this.setSpeed(6);
							break;

						case 55:
						case 103:
						e.stopPropagation();
							this.setSpeed(7);
							break;

						case 56:
						case 104:
						e.stopPropagation();
							this.setSpeed(8);
							break;

						case 57:
						case 105:
						e.stopPropagation();
							this.setSpeed(9);
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
				
				tmpScObj = {
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
					tmpScObj.alt = true;
				}
				if (e.ctrlKey)
				{
					tmpScObj.ctrl = true;
				}

				if (e.shiftKey)
				{
					tmpScObj.shift = true;
				}

				tmpScObj.code = e.code;

				scCompareE = [tmpScObj.alt, tmpScObj.code, tmpScObj.ctrl, tmpScObj.shift];

				for (let i = 0; i <= 11; i++)
				{
					scCompareS = [objs[i].o.alt, objs[i].o.code, objs[i].o.ctrl, objs[i].o.shift];
					if (JSON.stringify(scCompareE) === JSON.stringify(scCompareS))
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
							s.d += sDel;
							subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
						}

						if (i == 7)
						{
							e.preventDefault();
							s.d -= sDel;
							subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
						}

						if (i == 8)
						{
							e.preventDefault();
							s.d += sDelF;
							subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
						}

						if (i == 9)
						{
							e.preventDefault();
							s.d -= sDelF;
							subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
						}

						if (i == 10)
						{
							e.preventDefault();
							s.d += 1;
							subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
						}

						if (i == 11)
						{
							e.preventDefault();
							s.d -= 1;
							subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
						}

					}
				}

				if (JSON.stringify(scCompareE) === JSON.stringify([objs[12].o.alt, objs[12].o.code, objs[12].o.ctrl, objs[12].o.shift]))
				{
					e.preventDefault();
					subUpDwn(sMv * -1);

				}

				if (JSON.stringify(scCompareE) === JSON.stringify([objs[13].o.alt, objs[13].o.code, objs[13].o.ctrl, objs[13].o.shift]))
				{
					e.preventDefault();
					subUpDwn(sMv * 1);

				}

				tmpScObj = {
					id: null,
					ctrl: null,
					alt: null,
					shift: null,
					code: null,
					dispKey: null,
					wheelDeltaX: null,
					wheelDeltaY: null
				};
				scCompareE = [];
				scCompareS = [];

			}

		}
	};

	vController.vidControl.prototype.handleMouseDown_ = function(e)
	{
		if (e.path[0].tagName == 'INPUT' ||
			e.path[0].tagName == 'TEXTAREA' ||
			e.path[0].isContentEditable)
		{
			e.path[0].offsetParent.draggable = false;
		}
		else
		{

			e.path[0].offsetParent.draggable = true;

			if (!e.target.classList.contains('vController-btn'))
			{
				return;
			}

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
				this.delete();
			}
			else
			{
				e.preventDefault();
				e.stopPropagation();
				this.cursor = 'grabbing';
			}

		}
	};

	vController.vidControl.prototype.handleWheel_ = function(e)
	{

		if (e.path[0].tagName == 'INPUT' ||
			e.path[0].tagName == 'TEXTAREA' ||
			e.path[0].isContentEditable)
		{
			return;
		}
		else
		{

			tmpScObj = {
				id: null,
				ctrl: null,
				alt: null,
				shift: null,
				code: null,
				dispKey: null,
				wheelDeltaX: null,
				wheelDeltaY: null
			};

			tmpScObj.wheelDeltaX = e.deltaX / Math.abs(e.deltaX);
			tmpScObj.wheelDeltaY = e.deltaY / Math.abs(e.deltaY);
			if (e.altKey)
			{
				tmpScObj.alt = true;
			}
			if (e.ctrlKey)
			{
				tmpScObj.ctrl = true;
			}

			if (e.shiftKey)
			{
				tmpScObj.shift = true;
			}

			scCompareE = [tmpScObj.alt, tmpScObj.ctrl, tmpScObj.shift, tmpScObj.wheelDeltaX, tmpScObj.wheelDeltaY];

			for (let i = 0; i <= 11; i++)
			{
				scCompareS = [objs[i].o.alt, objs[i].o.ctrl, objs[i].o.shift, objs[i].o.wheelDeltaX, objs[i].o.wheelDeltaY];
				if (JSON.stringify(scCompareE) === JSON.stringify(scCompareS))
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
						s.d += sDel;
						subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
					}

					if (i == 7)
					{
						e.preventDefault();
						s.d -= sDel;
						subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
					}

					if (i == 8)
					{
						e.preventDefault();
						s.d += sDelF;
						subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
					}

					if (i == 9)
					{
						e.preventDefault();
						s.d -= sDelF;
						subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
					}

					if (i == 10)
					{
						e.preventDefault();
						s.d += 1;
						subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
					}

					if (i == 11)
					{
						e.preventDefault();
						s.d -= 1;
						subsDelay(s.track, s.origTrack, s.d, this.videoEl_, this.el_, this.bgEl_);
					}

				}
			}

			if (JSON.stringify(scCompareE) === JSON.stringify([objs[12].o.alt, objs[12].o.code, objs[12].o.ctrl, objs[12].o.shift]))
			{
				e.preventDefault();
				subUpDwn(-1 * sMv);
			}

			if (JSON.stringify(scCompareE) === JSON.stringify([objs[13].o.alt, objs[13].o.code, objs[13].o.ctrl, objs[13].o.shift]))
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

			tmpScObj = {
				id: null,
				ctrl: null,
				alt: null,
				shift: null,
				code: null,
				dispKey: null,
				wheelDeltaX: null,
				wheelDeltaY: null
			};
			scCompareE = [];
			scCompareS = [];

		}
	}

	/*
	vController.vidControl.prototype.handleDblClick_ = function(e) {
	        if (!e.target.classList.contains('vController-btn')) {
	                return;
	        }
	        e.preventDefault();
	        e.stopPropagation();
	};
	*/

	function getOffset(el)
	{
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY
		};
	}

	vController.vidControl.prototype.handleDragEndEvent_ = function(e)
	{
		this.cursor = 'initial';
		var leftPosition;

		if (e.clientX < getOffset(this.videoEl_).left)
		{
			leftPosition = 0;
		}
		else if (e.clientX > getOffset(this.videoEl_).left + this.videoEl_.clientWidth)
		{
			leftPosition = this.videoEl_.clientWidth;
		}
		else
		{
			leftPosition = e.clientX - getOffset(this.videoEl_).left;
		}

		var topPosition;
		if (e.clientY < getOffset(this.videoEl_).top)
		{
			topPosition = 0;
		}
		else if (e.clientY > getOffset(this.videoEl_).top + this.videoEl_.clientHeight)
		{
			topPosition = this.videoEl_.clientHeight;
		}
		else
		{
			topPosition = e.clientY - getOffset(this.videoEl_).top
		}

		this.el_.style.left = `${leftPosition}px`;
		this.el_.style.top = `${topPosition}px`;
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

	function cd_s_hmmss(s)
	{

		var ss = "00";
		var mm = "00"
		var hh = "";

		var hours = Math.floor(Math.ceil(s) / 3600);
		if (hours > 0)
		{
			hh = hours + ":";
		}

		var mins = Math.floor((Math.ceil(s) - hours * 3600) / 60);

		if (mins < 10)
		{
			mm = "0" + mins;
		}
		else
		{
			mm = mins;
		}
		var secs = Math.ceil(s - hours * 3600 - mins * 60);

		if (secs < 10)
		{
			ss = "0" + secs;
		}
		else
		{
			ss = secs;
		}

		return hh + mm + ":" + ss
	}

	vController.vidControl.prototype.rmng = function()
	{
		rem = (this.videoEl_.duration - this.videoEl_.currentTime) / this.videoEl_.playbackRate;
		let speed = this.videoEl_.playbackRate;
		rem = cd_s_hmmss(rem);
		return speed.toLocaleString('en-GB',
		{
			minimumFractionDigits: 2,
			maximumFractionDigits: 7
		}) + " | " + rem;
	}

	vController.vidControl.prototype.swtch = function()
	{
		let speed = this.videoEl_.playbackRate;
		
		if (pR1 == speed)
		{
			return swtchTo + 'x';
		}
		else
		{

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
		}
	}

	vController.vidControl.prototype.delete = function()
	{
		this.el_.parentNode.removeChild(this.el_);
	};

	vController.vidControl.insertAll = function()
	{
		var videoTags = [
			...document.getElementsByTagName('video'),
			...document.getElementsByTagName('audio')
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
			vController.vidControl.instances=removeEls(instance,vController.vidControl.instances);
			}
		
		});
	}

		Array.prototype.forEach.call(videoTags, function(videoTag)
		{


			
			if ((videoTag.src.length > 0) || (videoTag.currentSrc.length > 0))
			{
				if (!videoTag.getAttribute('vController-video-control'))
				{
					videoTag.setAttribute('vController-video-control', true);
					new vController.vidControl(videoTag);
				}
			}
		});
	};

	let timer;

	const observer = new MutationObserver((mutations) =>
	{
		if (timer)
		{
			clearTimeout(timer);
		}
		timer = setTimeout(() =>
		{
			vController.vidControl.insertAll();
		}, 150);
	});

	observer.observe(document,
	{
		attributes: true,
		childList: true,
		subtree: true
	});
}