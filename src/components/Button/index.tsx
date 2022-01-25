import { FC, FormEvent, useCallback } from 'react';

import { Loader } from 'components';

import { TButton, TButtonTheme } from 'types';

import s from './styles.module.scss';

interface IButton {
  id: string;
  onClick?: (e: string | File) => void;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
  type?: TButton;
  theme?: TButtonTheme;
  className?: string;
  isLoading?: boolean;
  name?: string;
  value?: string;
  disabled?: boolean;
}

const Button: FC<IButton> = ({
  id,
  onClick,
  onChange,
  name = 'button',
  type = 'button',
  theme = 'white',
  isLoading = false,
  className = '',
  value = '',
  disabled = false,
}) => {
  const onButtonClick = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (onClick) {
        onClick(e.currentTarget.value);
      }
    },
    [onClick],
  );

  const onChangeHandler = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    },
    [onChange],
  );

  return (
    <label
      className={`${s.wrapper} ${className} ${s[theme]} ${(disabled || isLoading) && s.disabled}`}
      htmlFor={id}
    >
      {isLoading && <Loader />}
      <span className={`${s.text} ${isLoading && s.hidden}`}>{name}</span>
      <input
        className={`${s.input} ${isLoading && s.hidden}`}
        onClick={onButtonClick}
        onChange={onChangeHandler}
        type={type}
        id={id}
        value={value}
        accept=".csv"
        disabled={isLoading || disabled}
      />
    </label>
  );
};

export default Button;
