# Trade - PlantUML vs MermaidJS

## Opening Observations

- MermaidJS is hands down winner in terms of execution environment
- PlantUML is hands down winner in terms of formal diagraming support

## Diagraming Comparison

Scoring: 0 - 3, where 0 == no support, 1 = lowest, 3 is highest

|Diagraming Feature |PlantUML |MermaidJS|
|-----------------|--------|---------|
|Use Cases |3|1|
|Classes   |3|3|
|Frames/Packages|3|0|
|Actors    |2|0|
|Components|3|1|
|Objects   |2|1|
|Activities|1|0|
|Relationships|2|2|

## Execution Environment Notes

- PlantUML requires external environment (e.g. Docker image, web service, AsciiDoctor extension)
- MermaidJS is a JS library we can include in the ML tools implementation as well as call from CLI or embed in web apps

## Previously Unspoken Observations

- PlantUML enables the use of standardized diagrams that other UML users can consume without any other prep or commentary
	- enables us to apply the degree of formalism we desire
- Is it possible to use the underlying MermaidJS engine without its syntax and diagram support
- **The trade here is level of formalism we actually need vs complexity of use**

## What are we currently diagraming?

- User Stories: Custom combination of use cases, objects, actors, activities, comments, and frames
- Data Structures: Classes, comments
- Stakeholder needs: Objects
- References: Objects
- Traceability: Showing multiple of the above on a diagram and the relationships between them

## Options

- PlantUML
- MermaidJS as is (how do you render our concepts using existing MermaidJS diagrams
- Create our own diagram type in MermaidJS
- Keep looking for other tools (specifically JS tools)
	
## Keep Looking

Needs
- JS
- Text representation of the definition of the diagram, KISS syntax
- Save out to image file format
- Support all of our diagraming examples above

Tools to consider
- https://gojs.net/latest/index.html
- https://github.com/bpmn-io/bpmn-js
- https://github.com/bpmn-io/diagram-js
- https://stackoverflow.com/questions/7231039/javascript-libraries-for-drawing-uml-class-diagramms
- https://github.com/markushedvall/node-plantuml