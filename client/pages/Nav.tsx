import { Tooltip } from '@client/components/Tooltip';
import classNames from 'classnames';
import { useBridge } from '@client/hooks';
import { CodeIcon, CogIcon, ExclamationIcon, UserIcon } from '@heroicons/react/outline';
import React, { ComponentProps } from 'react';

export type IPage = 'dash' | 'settings' | 'user';

export function Nav({ navigate, page }: { page: IPage; navigate(page: IPage): void }): JSX.Element {
	const { openExternal } = useBridge();
	return (
		<div className="sticky top-0">
			<div className="z-50 mb-4 flex flex-row items-center justify-center gap-8 bg-thmBackground py-4 sm:sticky sm:top-0 sm:mt-[30vh] sm:flex-col sm:pr-4">
				<NavButton
					onClick={() => {
						navigate('dash');
					}}
					Icon={CodeIcon}
					active={page === 'dash'}
				/>
				<NavButton
					onClick={() => {
						navigate('settings');
					}}
					Icon={CogIcon}
					active={page === 'settings'}
				/>
				<NavButton
					onClick={() => {
						navigate('user');
					}}
					Icon={UserIcon}
					active={page === 'user'}
				/>
				<Tooltip Tip="Report an Issue">
					<NavButton
						onClick={() => {
							openExternal(
								'https://github.com/codethread/pancake-electron/issues/new?assignees=&labels=bug%2C+to+refine&template=bug_report.md&title='
							);
						}}
						Icon={ExclamationIcon}
						iconStyles="text-thmWarn"
						buttonStyles="border-thmWarn"
					/>
				</Tooltip>
			</div>
		</div>
	);
}

type INavButton = {
	Icon: (props: ComponentProps<'svg'>) => JSX.Element;
	iconStyles?: string;
	buttonStyles?: string;
	active?: boolean;
	onClick(): void;
};
export function NavButton({
	onClick,
	Icon,
	iconStyles,
	buttonStyles = 'border-thmPrimary',
	active,
}: INavButton): JSX.Element {
	return (
		<button
			type="button"
			disabled={active}
			onClick={() => {
				onClick();
			}}
			className={classNames(
				buttonStyles,
				'rounded-full border-2  p-2 text-thmPrimary transition-colors hover:bg-thmBackgroundSubtle hover:brightness-90 disabled:border-thmBackground disabled:bg-thmBackground'
			)}
		>
			<Icon className={classNames(iconStyles, 'inline-block w-6')} />
		</button>
	);
}
