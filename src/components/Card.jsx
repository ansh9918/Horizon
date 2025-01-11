const Card = ({
  className = '',
  textClassName = '',
  children,
  bgImage,
  extraContent = null,
}) => {
  return (
    <div
      className={`${className}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h1 className={`${textClassName}`}>{children}</h1>
      {extraContent}
    </div>
  );
};

export default Card;
