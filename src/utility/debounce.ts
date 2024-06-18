



export default function debounce<Args>(func: (args: Args) => void, timeout = 300):  (args: Args) => void{
  let timer: NodeJS.Timeout;
  return (args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(args); }, timeout);
  };
}