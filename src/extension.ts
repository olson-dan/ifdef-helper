import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerTextEditorCommand('ifdef-helper.displayIfdefs', (editor, edit) => {
		let stack: string[] = [];
		const doc = editor.document;
		const line_number = editor.selection.active.line;
		[...Array(line_number).keys()].forEach((i) => {
			const line = doc.lineAt(i).text.trim();
			if (line.startsWith("#if")) {
				stack.push(line);
			} else if (line.startsWith("#else") || line.startsWith("#elif")) {
				stack.push(line);
			} else if (line.startsWith("#endif")) {
				while (stack.length > 0) {
					let last = stack.pop();
					if (last !== undefined) {
						if (last.startsWith("#if")) {
							break;
						}
					}
				}
			}
		});
		vscode.window.showInformationMessage(stack.join(" -> "));
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
