import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Bla = ({ children }: Props) => {
  const isTest = 'true';
  const isTest2 = !!isTest;
  return (
    <div>
      {isTest2}
      {children}
    </div>
  );
};
