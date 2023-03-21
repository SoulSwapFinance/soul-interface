import classNames from "classnames";
import numeral from "numeral";

const classByColor = {
  primary1: {
    title: "text-gray-400",
    percent: "text-primary1-500",
    progressContainer: "bg-primary1-300",
    progressActive: "bg-primary1-500",
  },
  primary2: {
    title: "text-gray-400",
    percent: "text-primary2-500",
    progressContainer: "bg-primary2-300",
    progressActive: "bg-primary2-500",
  },
  primary3: {
    title: "text-primary3-400",
    percent: "text-primary3-500",
    progressContainer: "bg-primary3-300",
    progressActive: "bg-primary3-500",
  },
  secondary1: {
    title: "text-gray-400",
    percent: "text-secondary1-500",
    progressContainer: "bg-secondary1-300",
    progressActive: "bg-secondary1-500",
  },
  secondary2: {
    title: "text-gray-400",
    percent: "text-secondary2-500",
    progressContainer: "bg-secondary2-300",
    progressActive: "bg-secondary2-500",
  },
  secondary3: {
    title: "text-gray-400",
    percent: "text-secondary3-500",
    progressContainer: "bg-secondary3-300",
    progressActive: "bg-secondary3-500",
  },
};

const Progress = ({
  loading = false,
  color = "primary1",
  progress = 0,
  title = "",
  containerClass = "",
}: {
  loading?: boolean;
  color?:
    | "primary1"
    | "primary2"
    | "primary3"
    | "secondary1"
    | "secondary2"
    | "secondary3";
  progress?: number;
  title?: string;
  containerClass?: string;
}) => {
  const byColor = classByColor[color];
  return (
    <div className={classNames({ [containerClass]: true })}>
      <div className="flex justify-between text-sm">
        <div
          className={classNames({
            [byColor.title]: true,
            "font-semibold": true,
          })}
        >
          {loading ? (
            <div className="inline-block w-16 h-4 rounded loading"></div>
          ) : (
            title
          )}
        </div>
        <div
          className={classNames({
            [byColor.percent]: true,
            "font-medium": true,
          })}
        >
          {loading ? (
            <div className="inline-block w-16 h-4 rounded loading"></div>
          ) : (
            numeral(progress).format("%0.00")
          )}
        </div>
      </div>
      <div className="relative h-1 mt-2">
        {loading ? (
          <div className="h-1 rounded loading"></div>
        ) : (
          <>
            <span
              className={classNames({
                [byColor.progressContainer]: true,
                "absolute left-0 top-0 w-full h-full rounded": true,
              })}
            />
            <span
              className={classNames({
                [byColor.progressActive]: true,
                "absolute left-0 top-0 h-full rounded": true,
              })}
              style={{ width: `${progress * 100}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;