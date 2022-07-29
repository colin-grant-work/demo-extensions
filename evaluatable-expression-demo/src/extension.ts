import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerEvaluatableExpressionProvider({language: 'markdown', scheme: 'file'}, new MockDebugEvaluatableExtensionProvider);
}

class MockDebugEvaluatableExtensionProvider implements vscode.EvaluatableExpressionProvider {
	/** 
	 * If you hover over something before a variable declaration in the file, returns the last word on that line.
	 * If you hover over something after a variable declaration in the file, returns the last variable declared before your cursor.
	 * If that variable hasn't yet been declared, the debug hover just shows the request parameters; if it has been declared, it shows the value.
	 */
	provideEvaluatableExpression(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.EvaluatableExpression> {
		const text = document.getText(new vscode.Range(new vscode.Position(0,0), position));
		const regex = /\s\$\w+=/g;
		let expression: string | null = null;
		let matchIndex: number | null = null;
		while (true) {
			const match = regex.exec(text);
			if (match) {
				matchIndex = match.index+1;
				expression = match[0].slice(1, -1);
			} else {
				break;
			}
		}
		if (matchIndex !== null && expression !== null) {
			const wordPosition = document.positionAt(matchIndex);
			const range = new vscode.Range(wordPosition, new vscode.Position(wordPosition.line, wordPosition.character + expression.length));
			return new vscode.EvaluatableExpression(range, expression);
		}
		const line = document.lineAt(position.line);
		if (!line.isEmptyOrWhitespace) {
			for (let i = line.text.length; i >= 0; i--) {
				if (/\w/.test(line.text[i])) {
					const range = document.getWordRangeAtPosition(new vscode.Position(position.line, i));
					if (range) {
						const expression = document.getText(range);
						return new vscode.EvaluatableExpression(range, `"${expression}"`);
					} else {
						break;
					}
				}
			}
		}
		return null;
	}
}

export function deactivate() {}
