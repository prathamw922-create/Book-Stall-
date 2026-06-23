const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-surface-200 border-t-accent-400 rounded-full animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-400 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

export default Spinner;
