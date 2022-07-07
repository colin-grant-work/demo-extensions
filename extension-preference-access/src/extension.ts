// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
let sequence = 1;
let taskAndEditorChangeListener: vscode.Disposable | undefined = undefined;
export function activate(context: vscode.ExtensionContext) {
	// The motivation for this command is to show that the `affects` check can detect both modifications and deletions of whole files.
	context.subscriptions.push(vscode.commands.registerCommand('start-listening-for-changes', () => {
		if (!taskAndEditorChangeListener) {
			vscode.window.showInformationMessage("Now I'll tell you whenever I hear a config change to tasks or `editor.fontSize`!");
			context.subscriptions.push(taskAndEditorChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
				const changed = [];
				const firstWorkspaceRoot = vscode.workspace.workspaceFolders?.[0];
				if (e.affectsConfiguration('tasks')) {
					changed.push('tasks');
				}
				if (e.affectsConfiguration('tasks.tasks')) {
					changed.push('tasks.tasks');
				}
				if (e.affectsConfiguration('editor.fontSize')) {
					changed.push('editor.fontSize');
				}
				if (e.affectsConfiguration('editor.fontSize', { uri: firstWorkspaceRoot?.uri, languageId: 'rust' })) {
					changed.push(`editor.fontSize for rust in ${firstWorkspaceRoot?.name}`);
				}
				if (changed.length) {
					vscode.window.showInformationMessage(`${changed.join(' and ')} changed! ` + sequence++);
				}
			}));
		} else {
			vscode.window.showInformationMessage("I'm already listening to changes. Change something, and I'll tell you!");
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand('stop-listening-for-changes', () => {
		if (taskAndEditorChangeListener) {
			vscode.window.showInformationMessage("No longer listening for changes to `tasks` or `editor.fontSize`");
			taskAndEditorChangeListener.dispose();
			taskAndEditorChangeListener = undefined;
		} else {
			vscode.window.showInformationMessage("I'm not yet listening to changes. Run the command 'Listen for config changes'.");
		}
	}));
	// Running this command should modify editor.fontSize in workspace scope (multiroot) or folder scope (single-root)
	context.subscriptions.push(vscode.commands.registerCommand('check-config-no-override', () => {
		runTest(Override.none);
	}));
	// Running this command should modify editor.fontSize in workspace scope. It will affect an override if that setting is already overridden for `rust`, otherwise it will affect default configuration.
	context.subscriptions.push(vscode.commands.registerCommand('check-config-with-override', () => {
		runTest(Override.soft);
	}));
	// Running this command should modify editor.fontSize in workspace scope with an override for `rust` specifically.
	context.subscriptions.push(vscode.commands.registerCommand('check-config-with-forced-override', () => {
		runTest(Override.hard);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('access-non-existent-preference', () => {
		const value = vscode.workspace.getConfiguration('peaSoup').get('secretIngredients');
		vscode.window.showInformationMessage(`The value of 'peaSoup.secretIngredients' is: ${JSON.stringify(value)}`);
	}));
}

const enum Override {
	none,
	soft,
	hard,
}

async function runTest(override: Override) {
	let affectedBase = false;
	let affectedOverride = false;
	const toDispose = vscode.workspace.onDidChangeConfiguration(e => {
		affectedBase = e.affectsConfiguration('editor.fontSize');
		affectedOverride = e.affectsConfiguration('editor.fontSize', { languageId: 'rust' });
	});
	let newValue;
	const baseValue = vscode.workspace.getConfiguration('editor');
	const overrideValue = vscode.workspace.getConfiguration('editor', { languageId: 'rust' });
	const startingBaseValue = baseValue.inspect('fontSize');
	const startingOverrideValue = overrideValue.inspect('fontSize');
	const startingBaseIndexedValue = baseValue.fontSize;
	const startingOverriddenIndexedValue = overrideValue.fontSize;
	console.log('SENTINEL FOR SOME INSPECTIONS?', { startingBaseValue, startingOverrideValue }, { baseIndexed: baseValue.fontSize, overrideIndexed: overrideValue.fontSize });
	let change;
	switch (override) {
		case Override.none: change = baseValue.update('fontSize', newValue = 23); break;
		case Override.soft: change = overrideValue.update('fontSize', newValue = 34); break;
		case Override.hard: change = overrideValue.update('fontSize', newValue = 17, false, true); break;
	}
	await Promise.allSettled([change, new Promise(resolve => setTimeout(resolve, 3000))]);
	const newBaseValue = baseValue.inspect('fontSize');
	const newOverrideValue = overrideValue.inspect('fontSize');
	const newBaseIndexedValue = baseValue.fontSize;
	const newOverriddenIndexedValue = overrideValue.fontSize;

	vscode.window.showInformationMessage(`Started with (scoped) base: ${startingBaseValue?.workspaceValue} and [rust] ${startingOverrideValue?.workspaceValue
		} and (indexed) base: ${startingBaseIndexedValue} and [rust]: ${startingOverriddenIndexedValue}. Set ${override ? '[rust]' : 'base'} to ${newValue}. The change affected base (${affectedBase}) and [rust] (${affectedOverride
		}). Ended with (scoped) values base: ${newBaseValue?.workspaceValue} and [rust]: ${newOverrideValue?.workspaceValue} and (indexed) base: ${newBaseIndexedValue} and [rust]: ${newOverriddenIndexedValue}.`);

	toDispose.dispose();
}

// this method is called when your extension is deactivated
export function deactivate() { }
