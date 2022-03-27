import { Output } from '../interfaces/Output';
import { InitialPath } from './InitialPath';
import { PercentagePath } from './PercentagePath';
import { TridentRoute } from './TridentRoute';
export interface ComplexPathParams extends TridentRoute {
    initialPath: InitialPath[];
    percentagePath: PercentagePath[];
    output: Output[];
}
