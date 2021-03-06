// Ours
import {AbstractMatrix} from './abstract-matrix';

const OUTPUT_REGEX = /\d{2}/g;

export class HdmiMatrix extends AbstractMatrix {
	name = 'HDMI';

	// Serial connection
	baudRate = 57600;

	// Serial protocol
	fullUpdateTriggers = [
		/^<@WVSO/, // Reply to one of our "set output" commands.
		/^==================================$/ // When the unit powers up.
	];
	fullUpdateRequest = '>@R8006';
	fullUpdateResponse = /^OUT CHANGE SET/;

	processFullUpdate(data: string) {
		const matches = data.match(OUTPUT_REGEX);
		if (matches) {
			return matches.map(match => {
				return parseInt(match, 10) - 1;
			});
		}

		return this.state.outputs;
	}

	protected _buildSetOutputCommand(output: number, input: number) {
		return `>@WVSO[0${output + 1}]I[0${input + 1}]${this.delimiter}`;
	}
}
