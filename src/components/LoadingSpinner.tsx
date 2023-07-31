interface LoadingSpinner {
  isActive: boolean;
}

export default function LoadingSpinner({ isActive }: LoadingSpinner) {
  return (
    <div
      className={
        isActive
          ? "lds-roller loading-spinner"
          : "lds-roller loading-spinner hidden"
      }
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
