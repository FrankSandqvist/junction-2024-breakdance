import * as math from "mathjs";

const MAX_X = 276.77;
const MAX_Y = 563.56;

const makeTransform = (lat: number[], lon: number[]) => {
  const x = lon;
  const y = lat;

  const X = [0, MAX_X, 0, MAX_X];
  const Y = [0, 0, MAX_Y, MAX_Y];

  let A = [];
  let b = [];

  for (let i = 0; i < 4; i++) {
    A.push([x[i], y[i], 1, 0, 0, 0, -x[i] * X[i], -y[i] * X[i]]);
    b.push(X[i]);

    A.push([0, 0, 0, x[i], y[i], 1, -x[i] * Y[i], -y[i] * Y[i]]);
    b.push(Y[i]);
  }

  const A_matrix = math.matrix(A);
  const b_matrix = math.matrix(b);

  const h = math.lusolve(A_matrix, b_matrix).toArray();
  const h_flat = h.map((entry) => (entry as any)[0]);

  const H = [
    [h_flat[0], h_flat[1], h_flat[2]],
    [h_flat[3], h_flat[4], h_flat[5]],
    [h_flat[6], h_flat[7], 1],
  ];

  return (lon: any, lat: any) => {
    const x = lon;
    const y = lat;

    const u = H[0][0] * x + H[0][1] * y + H[0][2];
    const v = H[1][0] * x + H[1][1] * y + H[1][2];
    const w = H[2][0] * x + H[2][1] * y + H[2][2];

    const X = u / w;
    const Y = v / w;

    return [X, Y];
  };
};

const mapLatLonToXY = makeTransform(
  [
    60.16277848100136, 60.16188212792141, 60.162342276621594,
    60.161368775236504,
  ],
  [
    24.905510259264723, 24.905873777579796, 24.901933880547283,
    24.902447082874446,
  ]
);

export const Map = ({
  reports,
  currentCoords,
  onClickReport,
}: {
  reports: Array<[number, number]>;
  currentCoords: [number, number];
  onClickReport: (idx: number) => any;
}) => {
  console.log(reports);
  console.log(currentCoords);

  const mappedReports = reports.map((report) => {
    const [mappedX, mappedY] = mapLatLonToXY(report[1], report[0]);
    return [mappedX, mappedY];
  });
  const [mappedX, mappedY] = mapLatLonToXY(currentCoords[1], currentCoords[0]);

  console.log(mappedX, mappedY);

  return (
    <svg
      id="Layer_2"
      data-name="Layer 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`-50 -50 ${MAX_X + 100} ${MAX_Y + 100}`}
      className="w-full h-full"
    >
      <path
        className="fill-primary"
        d="M258.82,210.66h14.87c1.42,0,2.58,1.15,2.58,2.58v34.9c0,1.42-1.15,2.58-2.58,2.58h-14.87c-1.42,0-2.58,1.15-2.58,2.58v271.06c0,1.42-1.16,2.58-2.58,2.58h-17.6c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-18.58c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-18.58c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-18.58c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-18.58c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-18.58c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-18.58c-.88,0-1.59.71-1.59,1.59v1.97c0,.88-.71,1.59-1.59,1.59h-17.6c-1.42,0-2.58-1.15-2.58-2.58v-258.95c0-1.42,1.15-2.58,2.58-2.58h59.79c1.42,0,2.58,1.15,2.58,2.58v142.02c0,1.44,1.19,2.61,2.63,2.58l34.71-.02c1.44.03,2.63-1.13,2.63-2.58l.02-17.77-.03-361.7c0-1.42,1.15-2.58,2.58-2.58h64.08c1.42,0,2.58,1.15,2.58,2.58v144.03c0,1.42,1.15,2.58,2.58,2.58Z"
      />
      <path
        className="fill-primary"
        d="M159.2.5h-90.84c-1.42,0-2.58,1.16-2.58,2.58v11.52c0,1.42-1.15,2.58-2.58,2.58h-6.64c-1.42,0-2.58,1.16-2.58,2.58v32.67c0,1.42-1.15,2.58-2.58,2.58h-18.64c-1.42,0-2.58,1.16-2.58,2.58v100.81c0,1.42,1.15,2.58,2.58,2.58h26.37c1.42,0,2.58,1.15,2.58,2.58v15.08c0,1.42,1.15,2.58,2.58,2.58h15.07c1.42,0,2.58,1.15,2.58,2.58v38.19c0,1.42-1.15,2.58-2.58,2.58h-20.9c-1.42,0-2.58-1.16-2.58-2.58v-12.27c0-1.42-1.15-2.58-2.58-2.58h-6.32c-1.42,0-2.58,1.15-2.58,2.58v12.27c0,1.42-1.15,2.58-2.58,2.58H3.08c-1.42,0-2.58,1.16-2.58,2.58v56.66c0,1.42,1.15,2.58,2.58,2.58l83.15.03h58.07c1.42,0,2.58-1.15,2.58-2.58V127.58c0-1.42,1.15-2.58,2.58-2.58h6.42v-41.11c0-1.42,1.15-2.58,2.58-2.58h.74c1.42,0,2.58-1.15,2.58-2.58V3.08c0-1.42-1.15-2.58-2.58-2.58Z"
      />
      <polygon
        className="fill-primary"
        points="149.35 254.93 149.35 127.36 184.58 127.84 184.58 254.93 149.35 254.93"
      />
      {mappedReports.map(([mappedX, mappedY], i) => (
        <g key={i} onClick={() => onClickReport(i)}>
          <circle
            key={i}
            className="fill-black"
            cx={mappedX}
            cy={mappedY + 1}
            r="12"
          />
          <circle className="fill-secondary duration-300 hover:fill-white" cx={mappedX} cy={mappedY} r="10"/>
        </g>
      ))}
            <g className="animate-pulse pointer-events-none">
        <rect
          className="fill-black"
          x={mappedX - 50}
          y={mappedY - 40}
          width={100}
          height={30}
          rx={5}
          ry={5}
        />
        <rect
          className="fill-white"
          x={mappedX - 50}
          y={mappedY - 42}
          width={100}
          height={30}
          rx={5}
          ry={5}
        />
        <text
          x={mappedX}
          y={mappedY - 22}
          textAnchor="middle"
          className="font-jaro"
          fontSize={14}
        >
          You are here!
        </text>
        <path
          className="fill-black"
          d={`m ${mappedX} ${mappedY} l 5 -10 l -10 0 l 5 10`}
        />
        <path
          className="fill-white"
          d={`m ${mappedX} ${mappedY - 3} l 5 -10 l -10 0 l 5 10`}
        />
      </g>
      <text x="100" y="500" fontSize={10}>MKH.dwg</text>
    </svg>
  );
};
