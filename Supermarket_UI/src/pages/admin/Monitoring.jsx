import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  Select,
  Spinner,
} from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import {
  mockServices,
  mockSystemLogs,
  monitoringService,
  toList,
  withFallback,
} from '../../services/index.js'
import { Activity, Filter, RotateCcw, Search, Server, X } from 'lucide-react'

const LEVELS = ['INFO', 'WARN', 'ERROR']

const emptyFilters = {
  search: '',
  level: '',
  type: '',
  dateFrom: '',
  dateTo: '',
}

const emptyStatusQuery = {
  logType: '',
  dateFrom: '',
  dateTo: '',
  severity: '',
  keyword: '',
}

const levelTone = (level = '') => {
  if (level.toUpperCase() === 'ERROR') return 'red'
  if (level.toUpperCase() === 'WARN') return 'amber'
  return 'blue'
}

const actorOf = (log) => log.actor || log.user || 'system'
const typeOf = (log) => log.logType || log.service || 'System'
const dateOf = (log) => String(log.time || log.timestamp || '').slice(0, 10)

export default function Monitoring() {
  const [services, setServices] = useState([])
  const [systemLogs, setSystemLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [statusQuery, setStatusQuery] = useState(emptyStatusQuery)
  const [appliedStatusQuery, setAppliedStatusQuery] = useState(emptyStatusQuery)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [serviceResult, logResult] = await Promise.all([
        withFallback(() => monitoringService.services(), mockServices),
        withFallback(() => monitoringService.logs(), mockSystemLogs),
      ])
      setServices(toList(serviceResult.data))
      setSystemLogs(toList(logResult.data))
      setLoading(false)
    }
    load()
  }, [])

  const logTypes = useMemo(() => {
    const names = [
      ...services.map((service) => service.name),
      ...systemLogs.map(typeOf),
    ].filter(Boolean)
    return [...new Set(names)].sort()
  }, [services, systemLogs])

  const rows = useMemo(() => systemLogs.filter((log) => {
    const haystack = [log.code, log.time, actorOf(log), typeOf(log), log.level, log.message]
      .join(' ')
      .toLowerCase()
    const logDate = dateOf(log)
    const logLevel = String(log.level || '').toUpperCase()

    const topMatch = (!applied.search || haystack.includes(applied.search.trim().toLowerCase()))
      && (!applied.level || logLevel === applied.level)
      && (!applied.type || typeOf(log) === applied.type)
      && (!applied.dateFrom || logDate >= applied.dateFrom)
      && (!applied.dateTo || logDate <= applied.dateTo)

    const queryMatch = (!appliedStatusQuery.keyword || haystack.includes(appliedStatusQuery.keyword.trim().toLowerCase()))
      && (!appliedStatusQuery.logType || typeOf(log) === appliedStatusQuery.logType)
      && (!appliedStatusQuery.severity || logLevel === appliedStatusQuery.severity)
      && (!appliedStatusQuery.dateFrom || logDate >= appliedStatusQuery.dateFrom)
      && (!appliedStatusQuery.dateTo || logDate <= appliedStatusQuery.dateTo)

    return topMatch && queryMatch
  }), [applied, appliedStatusQuery, systemLogs])

  const upCount = services.filter((service) => service.status === 'UP').length
  const downCount = services.filter((service) => service.status === 'DOWN').length

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setQueryField = (key, value) => setStatusQuery((current) => ({ ...current, [key]: value }))

  const applyFilters = () => setApplied(filters)

  const resetFilters = () => {
    setFilters(emptyFilters)
    setApplied(emptyFilters)
  }

  const submitStatusQuery = () => setAppliedStatusQuery(statusQuery)

  const cancelStatusQuery = () => {
    setStatusQuery(emptyStatusQuery)
    setAppliedStatusQuery(emptyStatusQuery)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Administration · 3.4.3"
        title="Monitor System Logs and Status"
        subtitle="Review system activity, service health, severity, and operational events."
      />

      <FilterBar className="mb-6">
        <Field label="Search" className="grow">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Keyword"
              value={filters.search}
              onChange={(event) => setFilter('search', event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
            />
          </div>
        </Field>
        <Field label="Status">
          <Select value={filters.level} onChange={(event) => setFilter('level', event.target.value)}>
            <option value="">All</option>
            {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </Select>
        </Field>
        <Field label="Date" className="grow">
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} placeholder="From" />
            <Input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} placeholder="To" min={filters.dateFrom || undefined} />
          </div>
        </Field>
        <Field label="Type">
          <Select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}>
            <option value="">All</option>
            {logTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
        </Field>
        <div className="flex !basis-auto !grow-0 gap-2">
          <Button onClick={applyFilters}>Apply</Button>
          <Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-5">
          <section className="min-w-0 xl:col-span-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">System Log List</h2>
                <p className="mt-0.5 text-xs text-slate-500">Operational and audit events from connected services.</p>
              </div>
              <Badge tone="slate">{rows.length} logs</Badge>
            </div>
            <DataTable
              dense
              rows={rows}
              empty={{ title: 'No system logs found', subtitle: 'Try changing the filters or status query.' }}
              columns={[
                {
                  key: 'time',
                  header: 'Time',
                  render: (log) => <span className="whitespace-nowrap font-mono text-xs">{log.time || log.timestamp || '—'}</span>,
                },
                {
                  key: 'actor',
                  header: 'Actor',
                  render: (log) => <span className="font-medium text-slate-700">{actorOf(log)}</span>,
                },
                {
                  key: 'logType',
                  header: 'Log Type',
                  render: (log) => <Badge tone="slate">{typeOf(log)}</Badge>,
                },
                {
                  key: 'severity',
                  header: 'Severity',
                  render: (log) => <Badge tone={levelTone(log.level)} dot>{log.level || 'INFO'}</Badge>,
                },
                {
                  key: 'message',
                  header: 'Message',
                  render: (log) => <span className="block max-w-sm truncate text-slate-600" title={log.message}>{log.message || '—'}</span>,
                },
              ]}
            />
          </section>

          <Card className="xl:col-span-2">
            <CardHeader
              title="System Status"
              subtitle={`${upCount} services online · ${downCount} offline`}
              icon={Server}
              action={
                <div className="flex gap-1.5">
                  <Badge tone="green" dot>{upCount} UP</Badge>
                  {downCount > 0 && <Badge tone="red" dot>{downCount} DOWN</Badge>}
                </div>
              }
            />
            <CardBody className="flex min-h-[22rem] flex-col">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Field label="Log Type">
                  <Select value={statusQuery.logType} onChange={(event) => setQueryField('logType', event.target.value)}>
                    <option value="">All</option>
                    {logTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </Select>
                </Field>
                <Field label="Date Range">
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" value={statusQuery.dateFrom} onChange={(event) => setQueryField('dateFrom', event.target.value)} placeholder="From" />
                    <Input type="date" value={statusQuery.dateTo} onChange={(event) => setQueryField('dateTo', event.target.value)} placeholder="To" min={statusQuery.dateFrom || undefined} />
                  </div>
                </Field>
                <Field label="Severity">
                  <Select value={statusQuery.severity} onChange={(event) => setQueryField('severity', event.target.value)}>
                    <option value="">Info/Error</option>
                    {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
                  </Select>
                </Field>
                <Field label="Search Keyword">
                  <Input
                    placeholder="Actor/module"
                    value={statusQuery.keyword}
                    onChange={(event) => setQueryField('keyword', event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && submitStatusQuery()}
                  />
                </Field>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Activity size={16} className="text-brand-600" />
                  Live service overview
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {services.slice(0, 6).map((service) => (
                    <div key={service.name} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs shadow-sm">
                      <span className="truncate font-medium text-slate-600">{service.name}</span>
                      <Badge tone={service.status === 'UP' ? 'green' : 'red'}>{service.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <Button icon={Filter} onClick={submitStatusQuery}>Submit</Button>
                <Button variant="secondary" icon={X} onClick={cancelStatusQuery}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {!loading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">
          System activity is collected from reporting and monitoring services for administrator review.
        </div>
      )}
    </div>
  )
}
