'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { AdvancedRadio, FieldError, RadioGroup } from 'rizzui';
import cn from '@utils/class-names';

type Option = {
  label: string | JSX.Element;
  value: number | string;
};

interface GetRadioProps {
  name: string;
  options: Option[];
}

export default function GetRadio({ name, options }: GetRadioProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, ref } }) => {
          return (
            <RadioGroup
              value={value}
              setValue={onChange}
              className="flex flex-wrap items-center gap-4"
            >
              {options.map((option) => (
                <AdvancedRadio
                  key={option.value}
                  value={option.value}
                  contentClassName={cn(
                    'px-3 py-2 min-w-[unset] min-h-[unset] flex items-center justify-between content-classname',
                    'hover:border-mainColor focus:ring-mainColor peer-checked:border-mainColor peer-checked:ring-mainColor',
                    'hover:border-mainColor focus:ring-mainColor',
                    String(option.value) === String(value) &&
                      'border-mainColor ring-mainColor ring-1'
                  )}
                >
                  {typeof option.label === 'string' ? (
                    option.label
                  ) : (
                    <div className="flex items-center gap-2">
                      {option.label}
                    </div>
                  )}
                </AdvancedRadio>
              ))}
            </RadioGroup>
          );
        }}
      />
      {errors?.[name] && (
        <FieldError
          className="mt-1"
          error={errors?.[name]?.message as string}
        />
      )}
    </>
  );
}
