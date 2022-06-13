import * as vscode from 'vscode';

const supportedContributionPoints = [
	'comments/comment/context',
	'comments/comment/title',
	'comments/commentThread/context',
	'debug/callstack/context',
	'editor/context',
	'editor/title',
	'editor/title/context',
	'explorer/context',
	'scm/resourceFolder/context',
	'scm/resourceGroup/context',
	'scm/resourceState/context',
	'scm/title',
	'timeline/item/context',
	'view/item/context',
	'view/title',
	'menu-contribution-test.submenu',
];

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('menu-contribution-test.helloWorld', () => {
		vscode.window.showInformationMessage('Hello, your plugin is loaded...');
	}));
	for (const contributionPoint of supportedContributionPoints) {
		context.subscriptions.push(vscode.commands.registerCommand(`menu-contribution-test.${contributionPoint.replace(/\//g, '-')}`, (...args) => {
			console.log('SENTINEL FOR THE ARGS WE GET FOR', contributionPoint, '\n', ...args);
		}));
	}
	context.subscriptions.push(vscode.commands.registerCommand('menu-contribution-test.thumbsDown', () => {
		vscode.commands.executeCommand('setContext', 'menu-contribution-test.contextKey', 'thumbsDown');
	}));
	context.subscriptions.push(vscode.commands.registerCommand('menu-contribution-test.thumbsUp', () => {
		vscode.commands.executeCommand('setContext', 'menu-contribution-test.contextKey', 'thumbsUp');
	}));
}

export function deactivate() { }
