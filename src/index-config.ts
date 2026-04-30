import * as xml from 'xmlbuilder2';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { readXML } from './common.js';

enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
}

function usage() {
  console.log(`usage:\n  ${path.basename(process.argv[1])} <xml-sample-file> <config-output-path>`);
}

async function main() {
  if (process.argv.length < 4) {
    usage();
    process.exit(1);
  }
  const xsd = await readXML(process.argv[2]);
  const outputPath = process.argv[3];
  const document = xml.create(xsd);
  const output: any = {};

  output.name = 'TODO_NAME';
  output.version = '0.0.1';
  output.document = {
    version: '1.0',
    encoding: 'UTF-8',
    root: getElement(document.root().node as unknown as Node),
  };
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
}

function getElement(node: Node) {
  const output: any = {};
  output.name = node.nodeName;

  if (node.nodeType === NodeType.ELEMENT_NODE) {
    const element = node as unknown as Element;

    const attrs: any = {}
    const attributes = element.attributes;
    for (const attr of attributes) {
      attrs[attr.name] = attr.value;
    }
    if (Object.keys(attrs).length > 0) {
      output.attributes = attrs;
    }

    if (element.firstChild?.nodeType === NodeType.TEXT_NODE) {
      output.text = element.firstChild.nodeValue;
    } else {
      const chd = [];
      for (const child of element.childNodes) {
        if (child.nodeType === NodeType.COMMENT_NODE) {
          continue;
        }
        chd.push(getElement(child))
      }
      if (chd.length > 0) {
        output.children = chd;
      }
    }
  }

  return output;
}

main().catch(console.log);
