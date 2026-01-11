'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ComboboxProps {
  items: {
    label: string;
    value: string;
  }[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = 'Select option...',
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [width, setWidth] = React.useState<number | undefined>(undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          ref={(node) => {
            if (node) {
              setWidth(node.offsetWidth);
            }
          }}
        >
          <span
            className='truncate text-left flex-1 min-w-0 mr-2'
            title={
              value
                ? items.find((item) => item.value === value)?.label
                : placeholder
            }
          >
            {value
              ? items.find((item) => item.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={width ? { width: `${width}px` } : undefined}
      >
        <Command
          filter={(value, search) => {
            if (value.toLowerCase().startsWith(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput
            placeholder='Search...'
            className='h-9 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 focus:outline-none focus-visible:outline-none'
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={(currentValue) => {
                    const selectedItem = items.find(
                      (item) => item.label === currentValue
                    );
                    if (selectedItem) {
                      onValueChange?.(
                        selectedItem.value === value ? '' : selectedItem.value
                      );
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
