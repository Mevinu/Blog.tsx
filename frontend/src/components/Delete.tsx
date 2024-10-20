import httpClient from "../httpClient";

interface Props {
  url: string;
  submit: (success: boolean) => void;
}
export function Delete({ url, submit }: Props) {
  const onClick = async () => {
    await httpClient
      .delete(url)
      .then(function (response) {
        if (response.status == 200) {
          submit(true);
        }
      })
      .catch(() => {
        submit(false);
      });
  };

  return (
    <button onClick={onClick} className="nav-button warning-button">
      Delete
    </button>
  );
}
