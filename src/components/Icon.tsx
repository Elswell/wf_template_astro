interface Props {
  id: string;
  cl?: string;
}

const SvgIcon = ({ id, cl = "" }: Props) => {
  return (
    <svg className={cl}>
      <use xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
};

export default SvgIcon;
