import { Toaster } from 'sileo';
import 'sileo/styles.css';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      theme="light"
      options={{
        duration: 4000,
      }}
    />
  );
}
