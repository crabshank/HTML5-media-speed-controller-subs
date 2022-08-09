var hed = [...document.getElementsByTagName("head")][0];

var obj_plusSpd = {
	o:
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
};
var obj_minusSpd = {
	o:
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
};
var obj_switchSpd = {
	o:
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
};
var obj_bck = {
	o:
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
};
var obj_fwrd = {
	o:
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
};
var obj_hideCtrlr = {
	o:
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
};
var obj_sDelBUp = {
	o:
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
};
var obj_sDelBDwn = {
	o:
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
};
var obj_sDelBFUp = {
	o:
	{
		id: "sDelBFUp",
		"ctrl": null,
		"alt": true,
		"shift": true,
		"code": "ArrowUp",
		"dispKey": "ArrowUp",
		"wheelDeltaX": null,
		"wheelDeltaY": null
	}
};
var obj_sDelBFDwn = {
	o:
	{
		id: "sDelBFDwn",
		"ctrl": null,
		"alt": true,
		"shift": true,
		"code": "ArrowDown",
		"dispKey": "ArrowDown",
		"wheelDeltaX": null,
		"wheelDeltaY": null
	}
};
var obj_sDelB1Up = {
	o:
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
};
var obj_sDelB1Dwn = {
	o:
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
};
var obj_sMvUp = {
	o:
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
};
var obj_sMvDwn = {
	o:
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
};

var v_plusSpd = document.getElementById('plusSpd');
var v_minusSpd = document.getElementById('minusSpd');
var v_switchSpd = document.getElementById('switchSpd');
var v_bck = document.getElementById('bck');
var v_fwrd = document.getElementById('fwrd');
var v_hideCtrlr = document.getElementById('hideCtrlr');

var v_scrSpd = document.getElementById('scrSpd');
var v_pRIncrement = document.getElementById('pRIncrement');
var v_swtchTo = document.getElementById('swtchTo');
var v_sIncrement = document.getElementById('sIncrement');
var v_Alt_no = document.getElementById('Alt_no');
var v_colMat = document.getElementById('colMat');
var v_vidCSS = document.getElementById('vidCSS');
var v_videoCSS = document.getElementById('videoCSS');
var v_clrMtrx = document.getElementById('clrMtrx');
//var v_testSub =document.getElementById('testSub');
var v_blacklist = document.getElementById('blacklist');
var v_subtitlesCSS = document.getElementById('subtitlesCSS');
var v_subtitlesCSS_two = document.getElementById('subtitlesCSS_two');
var v_selFont = document.getElementById('selFont');
var v_allVidCss = document.getElementById('allVidCss');
var v_canvas = document.getElementById('canvas');

var v_sDel = document.getElementById('sDel');
var v_sDelBUp = document.getElementById('sDelBUp');
var v_sDelBDwn = document.getElementById('sDelBDwn');
var v_sDelF = document.getElementById('sDelF');
var v_sDelBFUp = document.getElementById('sDelBFUp');
var v_sDelBFDwn = document.getElementById('sDelBFDwn');
var v_sDelB1Up = document.getElementById('sDelB1Up');
var v_sDelB1Dwn = document.getElementById('sDelB1Dwn');
var v_sMv = document.getElementById('sMv');
var v_sMvUp = document.getElementById('sMvUp');
var v_sMvDwn = document.getElementById('sMvDwn');

var v_save = document.getElementById('save');

var v_tstImg = document.getElementById('tstImg');
v_tstImg.addEventListener('change', handleFile, false);
var ctx = document.getElementById('canvas').getContext('2d');

function handleFile(e)
{
	var mp_ct = 0;
	var mp_ct_s = 0;
	var url = URL.createObjectURL(e.target.files[0]);
	var img = document.createElement('img');

	img.addEventListener('load', function()
	{
		ctx.canvas.width = img.width;
		ctx.canvas.height = img.height;
		ctx.drawImage(img, 0, 0, img.width, img.height);

		var frame_data0 =
			ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	}, false);
	img.src = url;
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
var objs = [obj_plusSpd, obj_minusSpd, obj_switchSpd, obj_bck, obj_fwrd, obj_hideCtrlr, obj_sDelBUp, obj_sDelBDwn, obj_sDelBFUp, obj_sDelBFDwn, obj_sDelB1Up, obj_sDelB1Dwn, obj_sMvUp, obj_sMvDwn];

function fontPopul()
{
	chrome.fontSettings.getFontList(populate);
}

function populate(fonts)
{
	for (let i = 0; i < fonts.length; i++)
	{
		let tmpFntOpt = document.createElement('option');
		tmpFntOpt.textContent = fonts[i].displayName;
		if (tmpFntOpt.textContent == "Segoe UI")
		{
			tmpFntOpt.selected = "selected";
			v_selFont.value = tmpFntOpt.textContent;
		}
		tmpFntOpt.id = fonts[i].fontId.split(' ').join('_');
		v_selFont.appendChild(tmpFntOpt);
		selectStyl.innerHTML += 'option#' + tmpFntOpt.id + ' {font-family: "' + fonts[i].fontId + '";} ';

	}

}

fontPopul();
restore_options();

function restore_options()
{

	chrome.storage.sync.get(null, function(items)
	{
		if(v_selFont.length>0){
		if (Object.keys(items).length !== 0)
		{
			console.log(items);
			objs = items.scObjs;
			sets = items.settgs

			objs.forEach(function(obj, index)
			{
				document.getElementById(obj.o.id).addEventListener('click', scClk, false);
			});

			for (let i = 0; i < objs.length; i++)
			{
				defSc(objs[i].o, document.getElementById(objs[i].o.id));
			}

			document.getElementById(sets[0].n).checked = sets[0].s;
			document.getElementById(sets[1].n).value = sets[1].s;
			document.getElementById(sets[2].n).value = sets[2].s;
			document.getElementById(sets[3].n).checked = sets[3].s;
			document.getElementById(sets[4].n).checked = sets[4].s;

			var matVals = sets[5].s.split(' ');
			for (let i = 1; i < 21; i++)
			{
				var tmpId = 'colMat' + i;
				document.getElementById(tmpId).textContent = matVals[i - 1];
			}

			document.getElementById(sets[6].n).value = sets[6].s;
			let fnt = sets[8].s.split('font-family:')[1].trim().split(';')[0];
			v_selFont.selectedIndex=sets[7];
			for(let k=0; k<v_selFont.length; k++){
				if(v_selFont[k].value==fnt){
					v_selFont.selectedIndex=k;
					break;
				}
			}
			v_subtitlesCSS.innerText = sets[8].s.split(' font-family: ')[0];
			document.getElementById('testSub').style.cssText = sets[8].s + ' ' + " transform: translate(0%, 0%)" + sets[15].s.replace(/translate(.|\n)+?\)/g, "").replace(/transform(.|\n)*:/g, "").replace(/(\n| )/g, "") + " text-align: center; width: -webkit-fill-available; padding-left: 0px;";
			document.getElementById('testSub').style.setProperty("font-family", v_selFont.value);
			document.getElementById(sets[9].n).innerText = sets[9].s;
			document.getElementById(sets[10].n).checked = sets[10].s;
			document.getElementById(sets[11].n).value = sets[11].s;
			document.getElementById(sets[12].n).value = sets[12].s;
			document.getElementById(sets[13].n).value = sets[13].s;
			document.getElementById(sets[14].n).value = sets[14].s;
			v_subtitlesCSS_two.innerHTML = '';
			v_subtitlesCSS_two.innerText = sets[15].s;
		}
		else
		{
			save_options();
		}
	}else{
		restore_options();
	}
	});

}

var selectStyl = document.createElement('style');

hed.appendChild(selectStyl);

console.log(v_selFont);

var egSub = document.getElementById('testSub');
egSub.textContent = "Example line";
var egSb = document.createElement('style');

hed.appendChild(egSb);

v_save.addEventListener('click', save_options);

var strkCnt = {
	c: 0,
	tg: 0
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
var scClk = function(e)
{
	if (strkCnt.c == 0)
	{
		e.preventDefault();
		strkCnt.tg = e.composedPath()[0];

		//console.log(e);

		document.addEventListener("keydown", scKd);
		document.addEventListener("wheel", scWh);
		strkCnt.c++;

	}
};

var scKd = function(e)
{
	//console.log(e);
	e.preventDefault();
	if ((e.keyCode == 16) || (e.keyCode == 17) || (e.keyCode == 18))
	{
		return;
	}
	else
	{
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

		//tmpScObj.dispKey=e.key.split('Key').join('').split('Digit').join('');
		switch (e.location)
		{
			case 3:
				tmpScObj.dispKey = e.code;
				break;

			default:
				tmpScObj.dispKey = e.key;
				break;

		}

		finaliseSc();

	}

};

var scWh = function(e)
{
	e.preventDefault();

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

	finaliseSc();
};

function defSc(o, t)
{
	let dispSC = '';

	if (o.ctrl !== null)
	{
		dispSC += 'ctrl + ';
	}
	if (o.alt !== null)
	{
		dispSC += 'alt + ';
	}

	if (o.shift !== null)
	{
		dispSC += 'shift + ';
	}

	if (o.code !== null)
	{
		dispSC += o.dispKey;
	}

	if (o.wheelDeltaX !== null)
	{

		if (o.wheelDeltaX > 0)
		{
			dispSC += "scroll right";
		}
		else if (o.wheelDeltaX < 0)
		{
			dispSC += "scroll left";
		}
	}

	if (o.wheelDeltaY !== null)
	{
		if (o.wheelDeltaY < 0)
		{
			dispSC += "scroll up";
		}
		else if (o.wheelDeltaY > 0)
		{
			dispSC += "scroll down";
		}
	}

	t.textContent = dispSC;
	dispSC = '';

}

function finaliseSc()
{

	let dispSC = '';

	if (tmpScObj.ctrl !== null)
	{
		dispSC += 'ctrl + ';
	}
	if (tmpScObj.alt !== null)
	{
		dispSC += 'alt + ';
	}

	if (tmpScObj.shift !== null)
	{
		dispSC += 'shift + ';
	}

	if (tmpScObj.code !== null)
	{
		dispSC += tmpScObj.dispKey;
	}

	if (tmpScObj.wheelDeltaX !== null)
	{

		if (tmpScObj.wheelDeltaX > 0)
		{
			dispSC += "scroll right";
		}
		else if (tmpScObj.wheelDeltaX < 0)
		{
			dispSC += "scroll left";
		}
	}

	if (tmpScObj.wheelDeltaY !== null)
	{
		if (tmpScObj.wheelDeltaY < 0)
		{
			dispSC += "scroll up";
		}
		else if (tmpScObj.wheelDeltaY > 0)
		{
			dispSC += "scroll down";
		}
	}

	console.log(tmpScObj.id);
	switch (strkCnt.tg.id)
	{

		case 'plusSpd':
			tmpScObj.id = objs[0].o.id;
			objs[0].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'minusSpd':
			tmpScObj.id = objs[1].o.id;
			objs[1].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'switchSpd':
			tmpScObj.id = objs[2].o.id;
			objs[2].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'bck':
			tmpScObj.id = objs[3].o.id;
			objs[3].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'fwrd':
			tmpScObj.id = objs[4].o.id;
			objs[4].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'hideCtrlr':
			tmpScObj.id = objs[5].o.id;
			objs[5].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sDelBUp':
			tmpScObj.id = objs[6].o.id;
			objs[6].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sDelBDwn':
			tmpScObj.id = objs[7].o.id;
			objs[7].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sDelBFUp':
			tmpScObj.id = objs[8].o.id;
			objs[8].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sDelBFDwn':
			tmpScObj.id = objs[9].o.id;
			objs[9].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sDelB1Up':
			tmpScObj.id = objs[10].o.id;
			objs[10].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sDelB1Dwn':
			tmpScObj.id = objs[11].o.id;
			objs[11].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sMvUp':
			tmpScObj.id = objs[12].o.id;
			objs[12].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

		case 'sMvDwn':
			tmpScObj.id = objs[13].o.id;
			objs[13].o = tmpScObj;
			strkCnt.tg.textContent = dispSC;
			break;

	}
	console.log(JSON.stringify(tmpScObj));
	dispSC = '';
	strkCnt = {
		c: 0,
		tg: 0
	};
	tmpScObj = {
		ctrl: null,
		alt: null,
		shift: null,
		code: null,
		dispKey: null,
		wheelDeltaX: null,
		wheelDeltaY: null
	};
	document.removeEventListener("keydown", scKd, false);
	document.removeEventListener("wheel", scWh, false);
}

function testSb()
{
	egSub.style.cssText = v_subtitlesCSS.innerText + ' ' + " transform: translate(0%, 0%) " + v_subtitlesCSS_two.innerText.replace(/translate(.|\n)+?\)/g, "").replace(/transform(.|\n)*:/g, "").replace(/(\n| )/g, "") + " text-align: center; width: -webkit-fill-available; padding-left: 0px;";
	egSub.style.fontFamily = v_selFont.value;

}
testSb();

function testVCSS()
	{

		var matrixValue = null;
		if (document.getElementById('filter-sample_div'))
		{
			document.getElementById('filter-sample_div').remove();
		}
		var divm = document.createElement('div');

		divm.setAttribute('id', 'filter-sample_div');
		divm.setAttribute('style', 'display: none;');

		v_canvas.appendChild(divm);
		
		if (v_colMat.checked && v_vidCSS.checked)
		{
			matrixValue = v_clrMtrx.innerText;
			divm.innerHTML = "<svg><filter id='filter-sample'><feColorMatrix type='matrix' values='" + matrixValue + "'></feColorMatrix></filter></svg>";
			v_canvas.style = "filter: " + " url(#filter-sample) " + v_videoCSS.innerText;
		}
		else if (v_colMat.checked && !v_vidCSS.checked)
		{
			matrixValue = v_clrMtrx.innerText;
			divm.innerHTML = "<svg><filter id='filter-sample'><feColorMatrix type='matrix' values='" + matrixValue + "'></feColorMatrix></filter></svg>";
			v_canvas.style = "filter: " + " url(#filter-sample);";
		}
		else if (!v_colMat.checked && v_vidCSS.checked)
		{
			v_canvas.style = "filter: " + v_videoCSS.innerText;
		}
		else
		{
			v_canvas.style = "";
		}

	}
	//testSb();

v_selFont.addEventListener("change", testSb);
//egSub.addEventListener("change", testSb);
v_subtitlesCSS.addEventListener("change", testSb);
v_subtitlesCSS_two.addEventListener("change", testSb);

v_colMat.addEventListener("change", testVCSS);

v_vidCSS.addEventListener("change", testVCSS);

const observer = new MutationObserver((mutations) =>
{

	console.log(mutations);
	testVCSS();

});

const observerSub = new MutationObserver((mutations) =>
{

	console.log(mutations);
	testSb();

});

observer.observe(v_clrMtrx,
{
	characterData: true,
	attributes: true,
	childList: true,
	subtree: true
});

observer.observe(v_videoCSS,
{
	characterData: true,
	attributes: true,
	childList: true,
	subtree: true
});

observerSub.observe(v_subtitlesCSS,
{
	characterData: true,
	attributes: true,
	childList: true,
	subtree: true
});

observerSub.observe(v_subtitlesCSS_two,
{
	characterData: true,
	attributes: true,
	childList: true,
	subtree: true
});

function save_options()
{

	let lstChk = v_blacklist.value.split(',');
	let validate = true;

	lstChk = removeEls("", lstChk);

	for (let i = 0; i < lstChk.length; i++)
	{

		if (lstChk[i].split('/').length == 1)
		{
			console.log(lstChk[i] + ' is valid!');
		}
		else
		{

			if (lstChk[i].split('://')[0] == "")
			{
				document.getElementById('status').textContent = lstChk[i] + ' is invalid';
				console.warn(lstChk[i] + ' is invalid');
				validate = false;
			}

			if (lstChk[i].split('://')[lstChk[i].split('://').length + 1] == "")
			{
				document.getElementById('status').textContent = lstChk[i] + ' is invalid';
				console.warn(lstChk[i] + ' is invalid');
				validate = false;
			}

			if (lstChk[i].split('://').join('').split('/').length !== removeEls("", lstChk[i].split('://').join('').split('/')).length)
			{
				document.getElementById('status').textContent = lstChk[i] + ' is invalid';
				console.warn(lstChk[i] + ' is invalid');
				validate = false;
			}

		}

	}

	if (validate)
	{
		actSave();
	}

	function actSave()
	{

		sets = [
		{
			n: v_scrSpd.id,
			s: v_scrSpd.checked
		},
		{
			n: v_pRIncrement.id,
			s: v_pRIncrement.value
		},
		{
			n: v_sIncrement.id,
			s: v_sIncrement.value
		},
		{
			n: v_Alt_no.id,
			s: v_Alt_no.checked
		},
		{
			n: v_colMat.id,
			s: v_colMat.checked
		},
		{
			n: v_clrMtrx.id,
			s: v_clrMtrx.innerText
		},
		{
			n: v_blacklist.id,
			s: v_blacklist.value
		},
		{
			n: v_selFont.id,
			s: 0
		},
		{
			n: "subsStyl",
			s: v_subtitlesCSS.innerText + ' ' + 'font-family: ' + v_selFont.value + ';'
		},
		{
			n: v_videoCSS.id,
			s: v_videoCSS.innerText
		},
		{
			n: v_vidCSS.id,
			s: v_vidCSS.checked
		},
		{
			n: v_sDel.id,
			s: v_sDel.value
		},
		{
			n: v_sDelF.id,
			s: v_sDelF.value
		},
		{
			n: v_sMv.id,
			s: v_sMv.value
		},
		{
			n: v_swtchTo.id,
			s: v_swtchTo.value
		},
		{
			n: "subsStylTwo",
			s: v_subtitlesCSS_two.innerText
		}]

		let def_objsO = [obj_plusSpd.o, obj_minusSpd.o, obj_switchSpd.o, obj_bck.o, obj_fwrd.o, obj_hideCtrlr.o, obj_sDelBUp.o, obj_sDelBDwn.o, obj_sDelBFUp.o, obj_sDelBFDwn.o, obj_sDelB1Up.o, obj_sDelB1Dwn.o, obj_sMvUp.o, obj_sMvDwn.o];

		for (let i = 0; i <= 13; i++)
		{
			//console.log(objs[i]);
			if (objs[i].o == null)
			{
				objs[i].o = def_objs[i];
			}
			else
			{
				objs[i].o = objs[i].o;
			}
		}

		console.log(JSON.stringify(sets));
		console.log(JSON.stringify(objs));

		chrome.storage.sync.set(
		{
			scObjs: objs,
			settgs: sets
		}, function()
		{
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function()
			{
				status.textContent = '';
			}, 750);
			restore_options();
		});
	}
}