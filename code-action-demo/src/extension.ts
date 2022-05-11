// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class TestCodeProvider implements vscode.CodeActionProvider {
	protected _disposable: vscode.Disposable;

	constructor() {
		this._disposable = vscode.languages.registerCodeActionsProvider({ scheme: 'file' }, this);
	}

	dispose() {
		this._disposable.dispose();
	}

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
		if (range.start.compareTo(range.end) === 0) {
			return [];
		}
		console.log('SENTINEL FOR PROVIDING SOME CODE ACTIONS...');
		return [{
			title: "Test code action command",
			command: 'test.code.action.command',
			arguments: ['test'],
		}];
	}
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(new TestCodeProvider);
	context.subscriptions.push(vscode.commands.registerCommand('test.code.action.command', (...args) => {
		vscode.window.showInformationMessage('Code action execution succeeded with args: ' + args.join(', '));
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
