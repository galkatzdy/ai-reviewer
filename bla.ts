import { helper } from 'helper.ts';

enum Colors {
  Red = 'red',
  Blue = 'blue',
  Yellow = 'yellow',
}

enum Sizes {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

enum Variants {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
}

const test = () => {
  const result = 2 + 2;
  console.log({ result });
};
