import { type ReactNode, type FC } from 'react';

type Props = {
  children: ReactNode;
};

export const Bla: FC<Props> = ({ children }) => {
  const isTest = 'true';
  const isTest2 = Boolean(isTest);
  return (
    <>
      {isTest2}
      {children}
    </>
  );
};
