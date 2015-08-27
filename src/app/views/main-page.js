'use strict';

const frameModule = require('ui/frame');
const initApp = require('./../shared/utils/appInit');
import customUi from './../shared/modules/ui';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
import {debug, inspect} from './../shared/utils/debug';
import {templatesModel} from './../shared/utils/htmlRenderer.js';
import * as fs from 'file-system';

let contextObj = new Observable({
	rek: language.splashREK,
	listan: language.splashListan
});

let page;

const pageLoaded = function(args) {
	customUi.setViewDefaults();
	page = args.object;
	page.bindingContext = contextObj;
	loadInAppResources();
	loadData();
};

function loadInAppResources() {
	readAndRegisterInAppResources('jquery', 'jquery.js');
	readAndRegisterInAppResources('details-js', 'details-js.js');
}

function readAndRegisterInAppResources(name, filename) {
	var documents = fs.knownFolders.currentApp();
	var myFile = documents.getFile('in-app-resources/' + filename);

	myFile.readText()
		.then(function (content) {
			templatesModel.registerInAppResource(name, content);
		}, function (error) {
			debug('Could not read and register app resource: ' + name, 'error');
		});
}

function loadData() {
	contextObj.set('loadingCount', 0);
	contextObj.set('error', '');
	contextObj.set('errorTryAgain', '');

	let loadingInterval = setInterval(function () {
		let curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);

	initApp.init()
	.then(function () {
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		frameModule.topmost().navigate('views/menu-sections');
	})
	.catch(function (e) {
		debug('Could not load data during initial load');
		debug(JSON.stringify(e));

		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);

		if (e === 'NO_NETWORK') {
			contextObj.set('error', language.downloadDataInitial);
		} else {
			contextObj.set('error', language.downloadDataInitial);
		}

		contextObj.set('errorTryAgain', language.downloadDataTryAgain);
	});
}

exports.pageLoaded = pageLoaded;
exports.errorTryAgain = loadData;
