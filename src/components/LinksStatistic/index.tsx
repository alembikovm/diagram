/** @jsx h */
import { createElement as h } from "react";
import { useHistory } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import cn from "classnames";

import { jsonToQueryString } from "../../utils";

import "./LinksStatistic.css";

/*
Используя recharts вывести данные в виде диаграммы примерно как в example.jpg
Легенда и заголовок при клике должны открывать страницу из поля type и с запросом из поля "query" примерно так "/Links?filters=..."

Оформление стилей в БЭМ методологии
*/

const colorsConfig = { good: "#82ca9d", very_bad: "#a60202", null: "#ccc" };

let diagramData = {
  type: "Links",
  "chart-type": "donut",
  name: "Found links",
  id: "found-links",
  "two-columns": true,
  options: { keepSorting: true, requirePostprocess: true, onOverview: true },
  buckets: [
    {
      count: 134013,
      legend: "Crawled",
      key: "Crawled",
      color: "good",
      query: {
        filters:
          '{"combinator":"and","rules":[{"field":"target_info.no_crawl_reason","operator":"not_exists"},{"combinator":"and","rules":[{"field":"link_type","operator":"=","value":"A"}]}]}',
      },
    },
    {
      count: 20097,
      legend: "Uncrawled",
      key: "Uncrawled",
      color: "null",
      query: {
        filters:
          '{"combinator":"and","rules":[{"combinator":"and","rules":[{"field":"target_info.no_crawl_reason","operator":"exists"},{"field":"target_info.no_crawl_reason","operator":"!=","value":"Blocked_robots"}]},{"combinator":"and","rules":[{"field":"link_type","operator":"=","value":"A"}]}]}',
      },
    },
    {
      count: 139,
      legend: "Blocked by robots.txt",
      key: "Blocked by robots.txt",
      color: "very_bad",
      query: {
        filters:
          '{"combinator":"and","rules":[{"combinator":"and","rules":[{"field":"target_info.no_crawl_reason","operator":"exists"},{"field":"target_info.no_crawl_reason","operator":"=","value":"Blocked_robots"}]},{"combinator":"and","rules":[{"field":"link_type","operator":"=","value":"A"}]}]}',
      },
    },
  ],
  query: {
    filters:
      '{"combinator":"and","rules":[{"field":"link_type","operator":"=","value":"A"}]}',
  },
  total: 154249,
};

const DiagramCard = ({ data, type }) => {
  const history = useHistory();

  const handleOpenLink = (pathname, query) => {
    const serialisedData = jsonToQueryString(query);

    history.push({ pathname: `/${pathname}`, search: serialisedData });
  };

  return (
    <div className="diagram-card">
      <div className="diagram-card__statistic-list">
        {data.map(({ legend, key, count, query }, index) => (
          <div
            className={cn(
              "diagram-card__statistic-row",
              index === 0 && "diagram-card--crawled"
            )}
            key={key}
            onClick={() => handleOpenLink(type, query)}
          >
            <div className="diagram-card__legend">
              <span
                className="diagram-card__circle"
                style={{ backgroundColor: colorsConfig[data[index].color] }}
              />

              <span>{legend}</span>
            </div>

            <div
              className={cn(
                "diagram-card__count",
                index === 0 && "diagram-card--crawled"
              )}
            >
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieDiagramm = ({
  data,
  dataKey,
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  fill,
}) => (
  <ResponsiveContainer width={170} height={170}>
    <PieChart fill={fill}>
      <Pie
        data={data}
        dataKey={dataKey}
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        minAngle={1}
        blendStroke
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colorsConfig[data[index].color]} />
        ))}
        <Tooltip cursor={false} />
      </Pie>
    </PieChart>
  </ResponsiveContainer>
);

const LinksStatistic = () => {
  const history = useHistory();

  const handleOpenLink = (pathname, query) => {
    const serialisedData = jsonToQueryString(query);

    history.push({ pathname: `/${pathname}`, search: serialisedData });
  };

  return (
    <div className="links-statistic">
      <h3
        className="links-statistic-title"
        onClick={() => handleOpenLink(diagramData.type, diagramData.query)}
      >
        {diagramData.name}
        <span className="links-statistic__number">{diagramData.total}</span>
      </h3>

      <div className="links-statistic-information">
        <PieDiagramm
          data={diagramData.buckets}
          dataKey="count"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          startAngle={-220}
          fill="#ccc"
        />

        <DiagramCard data={diagramData.buckets} type={diagramData.type} />
      </div>
    </div>
  );
};

export default LinksStatistic;
