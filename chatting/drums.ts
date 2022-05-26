function KeyPad({setText, text}){
const keysValues = [
    { type: "single", value: " " },
    { type: "multiple", value: "abc" },
    { type: "multiple", value: "def" },
    { type: "multiple", value: "ghi" },
    { type: "multiple", value: "jkl" },
    { type: "multiple", value: "mno" },
    { type: "multiple", value: "pqrs" },
    { type: "multiple", value: "tuv" },
    { type: "multiple", value: "wxyz" },
    { type: "single", value: "REMOVE" },
  ];

let time = {start: 0, end: 0};
let timer: any;

const onActivated = () => {
    time.start = Date.now();
    }

const onDeactivated = () => {
    const newTime = {start: time.start, end: Date.now()};
    time = newTime;
    if (newTime.end - newTime.start > 1000) {
        if (timer.current === null) {
          let newText = {
            previousValue: text.current.previousValue + keysValues[index].longPressValue,
            currentValue: "",
          };
          setText(newText);
        } else {
          clearTimeout(timer.current);
          timer.current = null;
          setText({
            previousValue:
              text.current.previousValue +
              text.current.currentValue +
              keysValues[index].longPressValue,
            currentValue: "",
          });
        }
        setIsLongPressed(true);
      }
    }
}