import * as path from 'node:path';
import * as dateFns from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import * as xml from 'xmlbuilder2';
import { AssertionError } from 'node:assert';
import jp from 'jsonpath';

import { readConfig, readInput } from './common.js';

function usage() {
  console.log(`usage:\n  ${path.basename(process.argv[1])} <config-file> <input-file>`);
}

async function main() {
  if (process.argv.length < 4) {
    usage();
    process.exit(1);
  }

  const config = await readConfig(process.argv[2]);
  const input = await readInput(process.argv[3]);

  const options = {
    version: config.document.version,
    encoding: config.document.encoding,
    keepNullNodes: true,
    keepNullAttributes: true,
  }
  const document = xml.create(options);
  createElement(config.document.root, document, input);

  console.log(document.toString({ prettyPrint: true, indent: '\t' }));
}

function createElement(config: any, root: any, context: any) {
  const children = config.children || [];

  const element = root.ele(config.name, config.attributes);

  if (config.source) {
    element.txt(expandSource(element, config.source, context));
  } else {
    element.txt(config.text);
  }

  for (const child of children) {
    if (config.context) {
      const contexts = jp.query(context, config.context);
      for (const context of contexts) {
        createElement(child, element, context);
      }
    } else {
      createElement(child, element, context);
    }
  }

  return element;
}

function expandSource(element: any, source: any, context: any) {
  if (typeof source === 'object') {
    switch (source.kind) {
      case 'date':
        return sourceDate(source, context);
      default:
        throw new Error(`unknown source kind '${source.kind}'`);
    }
  } else {
    return jp.value(context, source)
  }
}

function sourceDate(source: any, context: any) {
  let d;
  try {
    d = parseDate(jp.value(context, source.input), source.inFormat);
  } catch (err) {
    if (err instanceof AssertionError) {
      d = parseDate(source.input, source.inFormt);
    } else {
      throw err;
    }
  }

  return dateFns.format(d, source.outFormat);
}

function parseDate(input: string | undefined, format: string | undefined) {
  const now = new UTCDate();

  if (input === undefined || typeof input !== 'string') {
    return now;
  }

  if (format === undefined || typeof input !== 'string') {
    return new UTCDate(input);
  }

  return dateFns.parse(input, format, now);
}

main().catch(console.log);
