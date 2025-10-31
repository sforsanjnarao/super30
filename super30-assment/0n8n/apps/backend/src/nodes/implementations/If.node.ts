import type { INode, INodeInput, INodeOutput } from '../INode.interface.ts';

export class IfNode implements INode {
  async execute(input: INodeInput): Promise<INodeOutput> {
    const { parameters, inputData } = input;

    const value1 = this.resolveValue(parameters.value1, inputData);
    const value2 = this.resolveValue(parameters.value2, inputData);
    const operator = parameters.operator; // e.g., 'equal', 'greaterThan', 'contains'

    let isMatch = false;

    // Perform the comparison logic
    switch (operator) {
      case 'equal':
        isMatch = (value1 === value2);
        break;
      case 'greaterThan':
        isMatch = (Number(value1) > Number(value2));
        break;
      // ... other operators
    }

    // This is the key part for routing nodes.
    // The worker will look for this 'branch' property.
    return {
      result: inputData, // Pass the original data through unchanged
      branch: isMatch ? 'true' : 'false',
    };
  }

  private resolveValue(valueOrTemplate: any, data: any): any {
    if (typeof valueOrTemplate === 'string' && valueOrTemplate.startsWith('{{')) {
      // Resolve from template
      const key = valueOrTemplate.match(/\{\{ \$json\.(.*?) \}\}/)?.[1];
      return key ? data[key] : valueOrTemplate;
    }
    // It's a static value
    return valueOrTemplate;
  }
}