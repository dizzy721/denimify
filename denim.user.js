// ==UserScript== 
//@id		deNimify
//@name         deNimify
//@version	1.0
//@description  Combines and hides comments on zetaboards for users on the black list
//@author	Bruddah JD
//@include	http://s4.zetaboards.com/*
// ==/UserScript==

var blacklist = ["Hi I'm Asylum", 'kleenex', 'emaciated ape'];

var postInfos = document.getElementsByClassName('c_username');

for (var i = 0; i < postInfos.length; i++) {
	var userName = getUsername(postInfos[i]);
	
	if (isBlacklisted(userName) >= 0) {
		var topLevelPost = postInfos[i]; 
		var levels = 0; 
		if (i+1 < postInfos.length){ 
			var textToAppend = "<hr>"; 
			console.log("User found: " + userName);
			retObj = processNextPost(userName, postInfos, i, textToAppend, levels); 
			if (retObj.text !== "<hr>") {
				combinePosts(topLevelPost, retObj.text);
			}
			console.log("Levels " + retObj.levels);
		}
		i += retObj.levels;
	}
}

function processNextPost(userName, postInfos, i, textToAppend, levels) {
	console.log("In Text " + textToAppend);
	if ( i+1 < postInfos.length){
		if (userName === getUsername(postInfos[i+1])) {
			var text = "";
			text = text.concat(textToAppend);
			text = text.concat(getContentToAppend(postInfos[i+1]));
			text = text.concat("<hr>");
			hidePost(postInfos[i+1]);
			levels+=1; 
			return processNextPost(userName, postInfos, i+1, text, levels);
		} 
	}
	return {text : textToAppend, levels : levels};
	
}

function getUsername(userNameElm) {
	return userNameElm.getElementsByClassName('member')[0].textContent;
}

function isBlacklisted(userName) {
	return blacklist.indexOf(userName); 
}

function getContentToAppend(userNameElm) {
	return getContent(userNameElm);
}

function getContent(userNameElm) {
	var postRow = getPostRow(userNameElm);
	var postElement = postRow.getElementsByClassName('c_post');
	var value = postElement[0].innerHTML;
	console.log("Got " + value);
	return value;
}

function hidePost(userNameElm) {
	getPostRow(userNameElm).innerHTML='';
	getPostRow(userNameElm).style.visibility='hidden';
	getSigRow(userNameElm).innerHTML='';
	getSigRow(userNameElm).style.visibility='hidden';
	getFooterRow(userNameElm).innerHTML='';
	getFooterRow(userNameElm).style.visibility='hidden';
	//userNameElm.parentElement.style.visibility='hidden';
	//userNameElm.parentElement.innerHTML='';
	
}

function getPostRow(userNameElm) {
	return userNameElm.parentElement.nextElementSibling;
}

function getSigRow(userNameElm) {
	return getPostRow(userNameElm).nextElementSibling;
}

function getFooterRow(userNameElm) {
	return getSigRow(userNameElm).nextElementSibling;
}

function combinePosts(topLevelPost, textToAppend){ 
	var topPostContent = getContent(topLevelPost);
	getPostRow(topLevelPost).getElementsByClassName('c_post')[0].innerHTML =  topPostContent + textToAppend;
}
