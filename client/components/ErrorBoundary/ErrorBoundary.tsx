import { errorUrl } from '@shared/constants';
import { IBridge } from '@shared/types/ipc';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../Button/Button';

type Props = {
	children: ReactNode;
	bridge: IBridge;
};

type State = {
	hasError: boolean;
	showLink: boolean;
	err?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, showLink: false };
	}

	public static getDerivedStateFromError(e: Error): State {
		return { hasError: true, showLink: false, err: e };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		const { props } = this;
		props.bridge.error(`[ErrorBoundary error] ${error.message}\n${errorInfo.componentStack}`);
	}

	public render(): JSX.Element {
		const { openExternal } = this.props.bridge;

		if (this.state.hasError) {
			const { name = '', message = '', stack = '' } = this.state.err ?? {};
			const url = errorUrl({ body: `${name}\n${message}\n${stack}` });
			return (
				<div className="mx-auto flex min-h-screen w-fit flex-col items-center justify-center">
					<div className="w-fit rounded bg-thmBackgroundBright p-8 text-center text-thmFg shadow">
						<p className="text-lg">Oh dear!</p>
						<p data-testid={2} className="mb-8">
							Something went wrong.
						</p>
						{this.state.showLink ? (
							<>
								<p className="mb-8">copy paste this url into your browser</p>
								<div className="w-[600px] break-words text-justify">
									<code className="text-xs text-thmWarn">{url}</code>
								</div>
							</>
						) : (
							<>
								<Button
									className="mb-8"
									onClick={() => {
										openExternal(url);
									}}
								>
									Please raise an Issue
								</Button>
								<Button
									onClick={() => {
										this.setState((s) => ({ ...s, showLink: true }));
									}}
									variant="tertiary"
								>
									Link above not working?
								</Button>
							</>
						)}
					</div>
				</div>
			);
		}
		return this.props.children as JSX.Element;
	}
}
