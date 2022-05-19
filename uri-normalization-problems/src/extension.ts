import * as vscode from 'vscode';

// Most code copied from https://github.com/alefragnani/vscode-bookmarks/blob/master/src/extension.ts for demonstration purposes.

function revealLine(line: number) {
	if (vscode.window.activeTextEditor) {
		let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
		if (line === vscode.window.activeTextEditor.selection.active.line) {
			reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
		}
		const newSe = new vscode.Selection(line, 0, line, 0);
		vscode.window.activeTextEditor.selection = newSe;
		vscode.window.activeTextEditor.revealRange(newSe, reviewType);
	}
}

function revealPosition(line: number, column: number) {
	if (vscode.window.activeTextEditor) {
		if (isNaN(column)) {
			revealLine(line);
		} else {
			let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
			if (line === vscode.window.activeTextEditor.selection.active.line) {
				reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
			}
			const newSe = new vscode.Selection(line, column, line, column);
			vscode.window.activeTextEditor.selection = newSe;
			vscode.window.activeTextEditor.revealRange(newSe, reviewType);
		}
	}
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "uri-normalization-problems" is now active!');

	let disposable = vscode.commands.registerCommand('uri-normalization-problems.open-and-reveal', () => {
		const theiaRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		const uri = vscode.Uri.file(`${theiaRoot}//packages/monaco/src/browser/monaco-editor-provider.ts`);
		console.log('SENTINEL FOR THE URI', uri, uri.toString(), uri.toJSON());
		const line = 178;
		const column = 49;
		vscode.workspace.openTextDocument(uri).then(doc => {
			vscode.window.showTextDocument(doc).then(() => {
				revealPosition(line - 1, column - 1);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
