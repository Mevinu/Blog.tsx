interface Props {
  message: string;
  buttonMessage: string;
  onClick: () => void;
}

export function MessageBox({ buttonMessage, message, onClick }: Props) {
  return (
    <>
      <div className="overlay"></div>
      <div className="message-box">
        <p>{message}</p>
        <button onClick={onClick}>{buttonMessage}</button>
      </div>
    </>
  );
}
