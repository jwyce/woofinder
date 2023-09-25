'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { CheckIcon, X } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '~/components/ui/command';

import { ScrollArea } from './scroll-area';

type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  fieldValue?: (string | null)[];
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  onSelect: (option: SelectOption[]) => void;
};

export function MultiSelect({ options, placeholder, className, fieldValue, onSelect }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectOption[]>(
    options.filter((o) => fieldValue?.includes(o.value)),
  );
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    onSelect(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleUnselect = React.useCallback((option: SelectOption) => {
    setSelected((prev) => prev.filter((s) => s.value !== option.value));
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  return (
    <Command onKeyDown={handleKeyDown} className={cn('overflow-visible bg-transparent', className)}>
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.slice(0, 5).map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {selected.length > 5 ? (
            <Badge variant="secondary">{`+${selected.length - 5}`}</Badge>
          ) : null}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? 'Select items...'}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <ScrollArea>
              <div className="max-h-72">
                <CommandGroup className="overflow-auto">
                  {options.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          setInputValue('');
                          if (selected.some((s) => s.value === option.value)) {
                            setSelected((prev) => prev.filter((s) => s.value !== option.value));
                          } else {
                            setSelected((prev) => [...prev, option]);
                          }
                        }}
                        className={'cursor-pointer'}
                      >
                        {selected.some((s) => s.value === option.value) ? (
                          <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                            <CheckIcon className="h-4 w-4" />
                          </span>
                        ) : null}
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            </ScrollArea>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
