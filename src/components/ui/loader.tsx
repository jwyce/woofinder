import { Spinner } from './spinner';

export function Loader() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <Spinner className="scale-[2] fill-red-300" />
    </div>
  );
}
