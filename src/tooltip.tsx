import { format } from 'd3-format';
import styled from 'styled-components';

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 10;
  border-radius: 5px;
  font-size: 1.4rem;
  padding: 1.24rem;
  background-color: var(--gray-100);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  top: ${(props) => (props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40)}px;
  left: ${(props) => (props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20)}px;
  width: 20rem;
  transform: ${(props) => `translate(${props.horizontalAlignment === 'left' ? '-100%' : '0%'},${props.verticalAlignment === 'top' ? '-100%' : '0%'})`};
`;

interface ColorProps {
  color: string;
}

const ColorEl = styled.div<ColorProps>`
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${(props) => props.color};
`;

export const Tooltip = (props: any) => {
  const {
    data,
    xPos,
    yPos,
  } = props;
  return (
    <TooltipEl x={xPos} y={yPos} verticalAlignment={yPos > window.innerHeight / 2 ? 'top' : 'bottom'} horizontalAlignment={xPos > window.innerWidth / 2 ? 'left' : 'right'}>
      <div>
        <h6 className='bold undp-typography'>
          {data.title}
        </h6>
        <div className='flex-div flex-space-between margin-top-07' style={{ alignItems: 'baseline' }}>
          <div className='flex-div flex-vert-align-center' style={{ gap: '5px' }}>
            <ColorEl color='#3288CE' />
            <p className='undp-typography margin-bottom-00'>
              Budget
            </p>
          </div>
          <p className='undp-typography bold margin-top-00'>
            $
            {format('.2s')(data.budget)}
          </p>
        </div>
        <div className='flex-div flex-space-between' style={{ alignItems: 'baseline' }}>
          <div className='flex-div flex-vert-align-center' style={{ gap: '5px' }}>
            <ColorEl color='#82B6E0' />
            <p className='undp-typography margin-bottom-00'>
              Expenditure
            </p>
          </div>
          <p className='undp-typography bold margin-top-00 margin-bottom-00'>
            $
            {format('.2s')(data.expenditure)}
          </p>
        </div>
      </div>
    </TooltipEl>
  );
};
