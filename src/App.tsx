import axios from 'axios';
import { format } from 'd3-format';
import { hierarchy, treemap } from 'd3-hierarchy';
import sumBy from 'lodash.sumby';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './style/antd.css';
import './style/style.css';
import './style/statCardStyle.css';
import { Tooltip } from './tooltip';

interface ColorProps {
  color: string;
}

const ColorEl = styled.div<ColorProps>`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.color};
`;

interface WidthProps {
  width: string;
}

const StatCardsDiv = styled.div<WidthProps>`
  width: ${(props) => props.width};
  cursor: auto;
`;

const App = () => {
  const [data, setData] = useState<any>(null);
  const [tooltip, setTooltip] = useState<any>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const propjectList = queryParams.get('projectIds')?.split('~');
    const endpoints1 = propjectList?.map((d) => `https://api.open.undp.org/api/projects/${d}.json`);
    const margin = {
      top: 0, right: 0, bottom: 0, left: 0,
    };
    const width = 960 - margin.left - margin.right;
    const height = 520 - margin.top - margin.bottom;

    if (endpoints1) {
      Promise.all(endpoints1.map((endpoint) => axios.get(endpoint))).then(
        axios.spread((...allData) => {
          const dataHierarchy = {
            children: allData.map((d) => ({
              id: d.data.project_id, title: d.data.project_title, budget: d.data.budget, expenditure: d.data.expenditure,
            })),
          };
          const root = hierarchy(dataHierarchy).sum((d: any) => d.budget);
          const treemapData = treemap()
            .size([width, height])
            .padding(2)(root);
          setData(treemapData.leaves());
        }),
      );
    }
  }, []);
  return (
    <div className='undp-container' style={{ maxWidth: '960px' }}>
      {
        data
          ? (
            <>
              <div className='flex-div margin-bottom-05' style={{ gap: '4rem', justifyContent: 'center' }}>
                <div className='flex-div flex-vert-align-center' style={{ gap: '5px' }}>
                  <ColorEl color='#3288CE' />
                  <div>
                    Budget:
                    {' '}
                    <span className='bold'>
                      $
                      {format('.2s')(sumBy(data, (d: any) => d.data.budget))}
                    </span>
                  </div>
                </div>
                <div className='flex-div flex-vert-align-center' style={{ gap: '5px' }}>
                  <ColorEl color='#82B6E0' />
                  <div>
                    Expenditure:
                    {' '}
                    <span className='bold'>
                      $
                      {format('.2s')(sumBy(data, (d: any) => d.data.expenditure))}
                    </span>
                  </div>
                </div>
              </div>
              <svg width='960px' viewBox='0 0 960 520'>
                {
                  data.map((d: any, i: number) => (
                    <g
                      key={i}
                      onMouseOver={(event) => { setTooltip({ data: d.data, xPos: event.clientX, yPos: event.clientY }); }}
                      onMouseMove={(event) => { setTooltip({ data: d.data, xPos: event.clientX, yPos: event.clientY }); }}
                      onMouseLeave={() => { setTooltip(null); }}
                      opacity={tooltip ? tooltip.data.title === d.data.title ? 1 : 0.4 : 1}
                    >
                      <rect
                        x={d.x0}
                        y={d.y0}
                        width={d.x1 - d.x0}
                        height={d.y1 - d.y0}
                        fill='#3288CE'
                      />
                      <rect
                        x={d.x0}
                        y={d.y0 + ((1 - (d.data.expenditure / d.data.budget)) * (d.y1 - d.y0))}
                        width={d.x1 - d.x0}
                        height={d.y1 - (d.y0 + ((1 - (d.data.expenditure / d.data.budget)) * (d.y1 - d.y0)))}
                        fill='#82B6E0'
                      />
                    </g>
                  ))
                }
              </svg>
              <h5 className='undp-typography margin-top-07 margin-bottom-05'>Project Listing</h5>
              {
                data.map((d: any, i: number) => (
                  <a key={i} href={`https://open.undp.org/projects/${d.data.id}`} target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
                    <div className='stat-card margin-bottom-05'>
                      <h6 className='undp-typography margin-bottom-05'>
                        {d.data.title}
                      </h6>
                      <div className='flex-div'>
                        <StatCardsDiv width='calc(50% - 1rem)'>
                          <p className='undp-typography margin-bottom-02'>
                            Budget
                          </p>
                          <h4 className='undp-typography bold margin-bottom-00'>
                            $
                            {format('.2s')(d.data.budget)}
                          </h4>
                        </StatCardsDiv>
                        <StatCardsDiv width='calc(50% - 1rem)'>
                          <p className='undp-typography margin-bottom-02'>
                            Expenditure
                          </p>
                          <h4 className='undp-typography bold margin-bottom-00'>
                            $
                            {format('.2s')(d.data.expenditure)}
                          </h4>
                        </StatCardsDiv>
                      </div>
                    </div>
                  </a>
                ))
              }
            </>
          ) : null
      }
      {
        tooltip ? <Tooltip data={tooltip.data} xPos={tooltip.xPos} yPos={tooltip.yPos} /> : null
      }
    </div>
  );
};

export default App;
