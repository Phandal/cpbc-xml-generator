import * as dateFns from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import * as xml from 'xmlbuilder2';
import { AssertionError } from 'node:assert';
import jp from 'jsonpath';

const input = {
  members: [
    {
      'Employee ID': 1,
      'First Name of Member': 'Jack',
      'Middle Name of Member': 'Kcaj',
      'Last Name of Member': 'Smith',
      'Payroll Begin Date': '04122025',
      'Payroll End Date': '04242025',
    },
    {
      'Employee ID': 2,
      'First Name of Member': 'Rhonda',
      'Middle Name of Member': 'Adnohr',
      'Last Name of Member': 'Newton',
      'Payroll Begin Date': '04122025',
      'Payroll End Date': '04242025',
    },
    {
      'Employee ID': 3,
      'First Name of Member': 'Sam',
      'Middle Name of Member': 'Mas',
      'Last Name of Member': 'Foobar',
      'Payroll Begin Date': '04122025',
      'Payroll End Date': '04242025',
    }
  ],
};

async function main() {
  const config = {
    name: 'Scotts Valley - CalPERS',
    version: '0.0.1',
    document: {
      version: '1.0',
      encoding: 'UTF-8',
      root: {
        name: 'soap:Envelope',
        attributes: {
          'xmlns:soap': 'https://schemas.xmlsoap.org/soap/envolope/',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns:cuns': 'http://calpers.ca.gov/PSR/CommonUtilitiesV1',
        },
        children: [
          {
            name: 'soap:Header',
            children: [
              {
                name: 'cuns:HeaderInfo',
                attributes: {
                  'xmlns:cuns': 'http://calpers.ca.gov/PSR/CommonUtilitiesV1',
                },
                children: [
                  {
                    name: 'cuns:InterfaceTypeId',
                    text: '10006',
                  },
                  {
                    name: 'cuns:BusinessPartnerId',
                    text: '1112223344',
                  },
                  {
                    name: 'cuns:SchemaVersion',
                    text: '1.0',
                  },
                  {
                    name: 'cuns:DateTime',
                    source: { kind: 'date', outFormat: `yyyy-MM-dd\'T\'H:mm:ss` },
                  },
                ],
              },
            ],
          },
          {
            name: 'soap:Body',
            children: [
              {
                name: 'n1:RetirementAndPayrollTransactions',
                attributes: {
                  'xsi:schemaLocation': 'http://calpers.ca.gov/PSR/PayrollRetirementV1 PayrollRetirementV.xsd',
                  'xmlns:cuns': 'http://calpers.ca.gov/PSR/CommonUtilitiesV1',
                  'xmlns:n1': 'http://calpers.ca.gov/PSR/PayrollRetirementV1',
                  'xmlns:rhtns': 'http://calpers.ca.gov/PSR/RetirementHealthTransactionsV1',
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                },
                children: [
                  {
                    name: 'n1:EmployerPayrollReport',
                    children: [
                      {
                        name: 'n1:Employer',
                        children: [
                          {
                            name: 'n1:EmployersCalPERSId',
                            text: '1112223344',
                          },
                          {
                            name: 'n1:Report',
                            children: [
                              {
                                name: 'n1:ReportPeriodBeginDate',
                                source: { kind: 'date', input: `$.members[0]['Payroll Begin Date']`, inFormat: 'MMddyyyy', outFormat: 'yyyy-MM-dd' }
                              },
                              {
                                name: 'n1:ReportPeriodEndDate',
                                source: { kind: 'date', input: `$.members[0]['Payroll End Date']`, inFormat: 'MMddyyyy', outFormat: 'yyyy-MM-dd' }
                              },
                              {
                                name: 'n1:ProgramType',
                                text: 'CPE',
                              },
                              {
                                name: 'n1:TestReport',
                                text: 'true',
                              },
                              {
                                name: 'n1:ReportType',
                                text: 'REG',
                              },
                              {
                                name: 'n1:PayrollScheduleType',
                                text: 'MON',
                              },
                              {
                                name: 'n1:ReportCounter',
                                children: [
                                  {
                                    name: 'n1:RecordType',
                                    text: 'PAY',
                                  },
                                  {
                                    name: 'n1:RecordTypeCount',
                                    text: 'TODO',
                                  },
                                  {
                                    name: 'n1:RecordTypeTotal',
                                    text: 'TODO',
                                  },
                                ]
                              },
                              {
                                name: 'n1:ReportCounter',
                                children: [
                                  {
                                    name: 'n1:RecordType',
                                    text: 'SCP',
                                  },
                                  {
                                    name: 'n1:RecordTypeCount',
                                    text: 'TODO',
                                  },
                                  {
                                    name: 'n1:RecordTypeTotal',
                                    text: 'TODO',
                                  },
                                ]
                              },
                              {
                                name: 'n1:ReportCounter',
                                children: [
                                  {
                                    name: 'n1:RecordType',
                                    text: 'OPR',
                                  },
                                  {
                                    name: 'n1:RecordTypeCount',
                                    text: 'TODO',
                                  },
                                  {
                                    name: 'n1:RecordTypeTotal',
                                    text: 'TODO',
                                  },
                                ]
                              },
                              {
                                name: 'n1:PayrollReportName',
                                text: 'Sample Payroll 1',
                              },
                              {
                                name: 'n1:Participant',
                                context: '$.members[*]',
                                children: [
                                  {
                                    name: 'n1:ParticipantInfo',
                                    children: [
                                      {
                                        name: 'n1:ParticipantsCalPERSId',
                                        source: `$['Employee ID']`,
                                      },

                                      {
                                        name: 'n1:FirstName',
                                        source: `$['First Name of Member']`
                                      },

                                      {
                                        name: 'n1:MiddleName',
                                        source: `$['Middle Name of Member']`
                                      },

                                      {
                                        name: 'n1:LastName',
                                        source: `$['Last Name of Member']`,
                                      },
                                    ],
                                  },
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                ],
              }
            ],
          },
        ],
      },
    },
  };

  const options = {
    version: config.document.version,
    encoding: config.document.encoding,
    keepNullNodes: true,
    keepNullAttributes: true,
  }
  const document = xml.create(options);
  createElement(config.document.root, document, input);

  console.log(document.toString({ prettyPrint: true }));
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
