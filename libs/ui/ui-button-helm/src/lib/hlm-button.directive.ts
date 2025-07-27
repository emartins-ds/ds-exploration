import { Directive, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_ng-icon]:pointer-events-none shrink-0 [&_ng-icon]:shrink-0 outline-none focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px] aria-invalid:ring-error-base/20 dark:aria-invalid:ring-error-base/40 aria-invalid:border-error-base cursor-default active:scale-95 transform-gpu',
	{
		variants: {
			variant: {
				default: 'bg-primary-base text-text-on-primary hover:brightness-90',
				destructive:
					'bg-error-base text-text-inverse hover:bg-error-dark focus-visible:ring-error-base/20 dark:focus-visible:ring-error-base/40 dark:bg-error-base/60',
				outline:
					'border border-primary-dark bg-white text-primary-dark hover:bg-primary-light dark:bg-bg-secondary/30 dark:border-border-secondary dark:hover:bg-bg-secondary/50',
				secondary: 'bg-primary-light text-text-primary hover:brightness-90',
				ghost: 'text-primary-dark hover:bg-primary-light',
				link: 'text-primary-dark underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>ng-icon]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>ng-icon]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>ng-icon]:px-4',
				icon: 'size-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
	selector: '[hlmBtn]',
	exportAs: 'hlmBtn',
	host: {
		'[class]': '_computedClass()',
		'(mousedown)': '_onMouseDown()',
		'(mouseup)': '_onMouseUp()',
		'(mouseleave)': '_onMouseLeave()',
		'(touchstart)': '_onTouchStart()',
		'(touchend)': '_onTouchEnd()',
	},
})
export class HlmButtonDirective {
	private readonly _config = injectBrnButtonConfig();

	private readonly _additionalClasses = signal<ClassValue>('');
	private readonly _isPressed = signal<boolean>(false);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			buttonVariants({ variant: this.variant(), size: this.size() }),
			this.userClass(),
			this._additionalClasses(),
			this._isPressed() ? 'scale-95' : ''
		),
	);

	public readonly variant = input<ButtonVariants['variant']>(this._config.variant);

	public readonly size = input<ButtonVariants['size']>(this._config.size);

	public readonly label = input<string>('Button');

	setClass(classes: string): void {
		this._additionalClasses.set(classes);
	}

	public _onMouseDown(): void {
		this._isPressed.set(true);
	}

	public _onMouseUp(): void {
		this._isPressed.set(false);
	}

	public _onMouseLeave(): void {
		this._isPressed.set(false);
	}

	public _onTouchStart(): void {
		this._isPressed.set(true);
	}

	public _onTouchEnd(): void {
		this._isPressed.set(false);
	}
}
