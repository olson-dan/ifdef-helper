import * as vscode from 'vscode';

function trimLine(line: String) {
	let trimmed = line.trim();
	if (trimmed.startsWith("#")) {
		// Strip any C++-style line comments so we have cleaner output.
		trimmed = trimmed.replace(/\/\/.*/, '').trim();
	}
	return trimmed;
}

const hover: vscode.HoverProvider = {
	provideHover(document, position, token) {
		let line_num = position.line;
		let line = document.lineAt(line_num).text.trim();
		if (!line.startsWith("#endif")) {
			return;
		}
		let endif_count = 1;
		let stack: string[] = [];
		while (line_num >= 0) {
			line_num = line_num - 1;
			line = trimLine(document.lineAt(line_num).text);
			if (line.startsWith("#endif")) {
				endif_count = endif_count + 1;
			} else if (endif_count === 1 && (line.startsWith("#else") || line.startsWith("#elif"))) {
				stack.push(line);
			} else if (line.startsWith("#if")) {
				endif_count = endif_count - 1;
				if (endif_count === 0) {
					stack.push(line);
					break;
				}
			}
		}
		if (stack.length > 0) {
			const text = stack.reverse().join(" -> ");
			return new vscode.Hover(text);
		}
	}
};

function showActiveIfdefs(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	let stack: string[] = [];
	const doc = editor.document;
	const line_number = editor.selection.active.line + 1;
	[...Array(line_number).keys()].forEach((i) => {
		const line = trimLine(doc.lineAt(i).text);
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
	if (stack.length > 0) {
		vscode.window.showInformationMessage(stack.join(" -> "));
	} else {
		vscode.window.showInformationMessage("No active #ifdefs");
	}
}

export function activate(context: vscode.ExtensionContext) {

	let hover1 = vscode.languages.registerHoverProvider('c', hover);
	let hover2 = vscode.languages.registerHoverProvider('cpp', hover);

	let command1 = vscode.commands.registerTextEditorCommand('ifdef-helper.displayIfdefs', showActiveIfdefs);

	context.subscriptions.push(hover1);
	context.subscriptions.push(hover2);
	context.subscriptions.push(command1);
}

export function deactivate() { }
