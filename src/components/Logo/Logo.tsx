export const Logo = () => {
  return (
    <span className="relative flex items-center gap-2 h-min">
      <div className="grid grid-cols-2 grid-row-2 min-h-min min-w-min">
        <span className="w-3 aspect-square bg-primary-400 [clip-path:polygon(0_0,100%_100%,100%_0)]"></span>
        <span className="w-3 aspect-square bg-primary-400 [clip-path:polygon(0_100%,100%_100%,100%_0)]"></span>
        <span className="w-3 aspect-square bg-transparent-400"></span>
        <span className="w-3 aspect-square bg-primary-400 [clip-path:polygon(0_100%,100%_0,0_0)]"></span>
      </div>
      <span className="relative [line-height:22px] h-min text-xl font-extrabold dark:font-semibold text-neutral-800 dark:text-white">
        {"Yotei"}
      </span>
    </span>
  );
};
