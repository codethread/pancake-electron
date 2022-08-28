import { CssSize } from '@shared/types/util';

export type SvgSize =
	| { color: string; size: CssSize }
	| { color: string; width: CssSize; height: CssSize };

type IconProps = {
	color: string;
	width: CssSize;
	height: CssSize;
};

export function useIcon(props: SvgSize): IconProps {
	const { width, height } = 'width' in props ? props : { width: props.size, height: props.size };
	return {
		width,
		height,
		color: 'thm-bright',
	};
}
