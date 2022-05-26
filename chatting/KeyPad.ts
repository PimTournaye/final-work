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
let itr = {current: 0};
let buttonIdx = null;

const onActivated = () => {
    time.start = Date.now();
    }

const onDeactivated = () => {
    const newTime = {start: time.start, end: Date.now()};
    time = newTime;
    if (newTime.end - newTime.start > 1000) {
        if (timer.current === null) {
          let newText = {
            previousValue: text.current.previousValue,
            currentValue: "",
          };
          setText(newText);
        } else {
          clearTimeout(timer.current);
          timer.current = null;
          setText({
            previousValue:
              text.current.previousValue +
              text.current.currentValue,
            currentValue: "",
          });
        }
  
      }
    }

    const onClickHandler = (index) => {
      // console.log("Click", time.end - time.start);
      if (timer.current === null) {
        if (keysValues[index].type === "single") {
          let newText = {
            previousValue: text.current.previousValue + keysValues[index].value,
            currentValue: "",
          };
          setText(newText);
        } else {
          itr.current = 0;
          let newText = {
            previousValue: text.current.previousValue,
            currentValue: keysValues[index].value[itr.current],
          };
          setText(newText);
          timer.current = setTimeout(() => {
            let modified = {
              previousValue:
                text.current.previousValue + text.current.currentValue,
              currentValue: "",
            };
            setText(modified);
          }, 1000);
        }
      } else {
        if (index === buttonIdx) {
          clearTimeout(timer.current);
          timer.current = null;
          itr.current = (itr.current + 1) % keysValues[index].value.length;
          let newText = {
            previousValue: text.current.previousValue,
            currentValue: keysValues[index].value[itr.current],
          };
          setText(newText);
          timer.current = setTimeout(() => {
            let modified = {
              previousValue:
                text.current.previousValue + text.current.currentValue,
              currentValue: "",
            };
            setText(modified);
          }, 1000);
        } else if (keysValues[index].type === "multiple") {
          clearTimeout(timer.current);
          timer.current = null;
          itr.current = 0;
          setText({
            previousValue: text.current.previousValue + text.current.currentValue,
            currentValue: keysValues[index].value[itr.current],
          });
          timer.current = setTimeout(() => {
            setText({
              previousValue:
                text.current.previousValue + text.current.currentValue,
              currentValue: "",
            });
          }, 1000);
        } else {
          clearTimeout(timer.current);
          timer.current = null;
          setText({
            previousValue:
              text.current.previousValue +
              text.current.currentValue +
              keysValues[index].value,
            currentValue: "",
          });
        }
      }
      buttonIdx = index;
    };
}