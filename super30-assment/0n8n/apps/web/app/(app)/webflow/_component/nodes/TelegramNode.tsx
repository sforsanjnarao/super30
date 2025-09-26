import { useCallback } from "react";
type Props={}
export function TextUpdaterNode(props:  Props) {
    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
      console.log(evt.target.value);
    }, []);
   
    return (
      <div className="text-updater-node">
        <div>
          <label htmlFor="text">Text:</label>
          <input id="text" name="text" onChange={onChange} />
        </div>
      </div>
    );
  }
  