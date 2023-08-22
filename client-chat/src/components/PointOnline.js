const PointOnline = (props) => {
  const { isOnline, hasText } = props;
  return (
    <>
      <span
        style={{
          width: 10,
          height: 10,
          display: "inline-block",
          borderRadius: 50,
          backgroundColor: isOnline ? "green" : "red",
        }}
      ></span>
      {hasText && (
        <span style={{marginLeft: 5}}>{isOnline ? "online": "offline"}</span>
      )}
    </>
  );
};

export default PointOnline;
