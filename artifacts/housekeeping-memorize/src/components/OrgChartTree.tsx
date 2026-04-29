import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RotateCcw, Check, X } from "lucide-react";

interface Node {
  id: string;
  label: string;
  reports: string[];
}

const TREE: Node[] = [
  { id: 'exec', label: 'Executive Manager', reports: ['hk-sup', 'pa-sup', 'linen-sup'] },
  { id: 'hk-sup', label: 'Housekeeping Supervisor', reports: ['hk-team'] },
  { id: 'pa-sup', label: 'Public Area Supervisor', reports: ['gardener', 'pa-att'] },
  { id: 'linen-sup', label: 'Linen Supervisor', reports: ['linen-att'] },
  { id: 'hk-team', label: 'Room Attendant, Chambermaid/Roomboy, Minibar Attendant', reports: [] },
  { id: 'gardener', label: 'Gardener', reports: [] },
  { id: 'pa-att', label: 'Public Area Attendant (Lobby)', reports: ['pest'] },
  { id: 'pest', label: 'Pest Control', reports: [] },
  { id: 'linen-att', label: 'Linen Attendant', reports: ['laundry'] },
  { id: 'laundry', label: 'Laundry Attendant', reports: ['iron'] },
  { id: 'iron', label: 'Iron / Steam Pressed', reports: [] },
];

const NODE_BY_ID = Object.fromEntries(TREE.map(n => [n.id, n]));

interface NodeBoxProps {
  id: string;
  blanked: boolean;
  filled: string;
  status: 'idle' | 'correct' | 'wrong';
  onChange: (id: string, val: string) => void;
  variant?: 'root' | 'level' | 'leaf';
}

function NodeBox({ id, blanked, filled, status, onChange, variant = 'level' }: NodeBoxProps) {
  const node = NODE_BY_ID[id];
  if (!node) return null;
  const base = "rounded-lg px-1.5 py-2 text-center border-2 min-h-[48px] flex items-center justify-center leading-tight break-words";
  const variantClass =
    variant === 'root'
      ? "bg-primary text-primary-foreground border-primary font-bold text-sm"
      : variant === 'leaf'
      ? "bg-card text-foreground border-border text-[11px] font-medium"
      : "bg-primary/10 text-foreground border-primary/40 font-semibold text-xs";

  if (!blanked) {
    return <div className={`${base} ${variantClass}`}>{node.label}</div>;
  }

  const statusClass =
    status === 'correct'
      ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
      : status === 'wrong'
      ? 'border-destructive bg-destructive/10 text-destructive'
      : 'border-dashed border-primary/60 bg-background';

  return (
    <div className={`${base} ${statusClass} p-1`}>
      <input
        type="text"
        value={filled}
        onChange={e => onChange(id, e.target.value)}
        className="w-full bg-transparent text-center text-xs font-medium outline-none placeholder:text-muted-foreground/60"
        placeholder="?"
      />
      {status === 'correct' && <Check className="w-4 h-4 ml-1 text-green-600 shrink-0" />}
      {status === 'wrong' && <X className="w-4 h-4 ml-1 text-destructive shrink-0" />}
    </div>
  );
}

function Connector({ height = 16 }: { height?: number }) {
  return <div className="w-px bg-border mx-auto" style={{ height }} />;
}

interface TreeProps {
  blanks: Set<string>;
  values: { [id: string]: string };
  statuses: { [id: string]: 'idle' | 'correct' | 'wrong' };
  onChange: (id: string, val: string) => void;
}

function Tree({ blanks, values, statuses, onChange }: TreeProps) {
  const renderNode = (id: string, variant: NodeBoxProps['variant'] = 'level') => (
    <NodeBox
      id={id}
      blanked={blanks.has(id)}
      filled={values[id] || ''}
      status={statuses[id] || 'idle'}
      onChange={onChange}
      variant={variant}
    />
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[380px] mx-auto p-2 space-y-1.5">
        <div className="text-center">
          <div className="inline-block min-w-[240px]">{renderNode('exec', 'root')}</div>
        </div>
        <Connector />
        <div className="grid grid-cols-3 gap-2 items-start">
          <div className="space-y-1.5">
            {renderNode('hk-sup')}
            <Connector />
            {renderNode('hk-team', 'leaf')}
          </div>
          <div className="space-y-1.5">
            {renderNode('pa-sup')}
            <Connector />
            {renderNode('gardener', 'leaf')}
            <Connector />
            {renderNode('pa-att', 'leaf')}
            <Connector />
            {renderNode('pest', 'leaf')}
          </div>
          <div className="space-y-1.5">
            {renderNode('linen-sup')}
            <Connector />
            {renderNode('linen-att', 'leaf')}
            <Connector />
            {renderNode('laundry', 'leaf')}
            <Connector />
            {renderNode('iron', 'leaf')}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s/,\-.]+/g, ' ').trim();
}

function isMatch(input: string, target: string) {
  const a = normalize(input);
  const b = normalize(target);
  if (!a) return false;
  if (a === b) return true;
  // Allow partial: each meaningful word in target appears in input
  const targetWords = b.split(' ').filter(w => w.length > 2);
  return targetWords.every(w => a.includes(w));
}

function isPaSupAnswer(input: string) {
  const a = normalize(input);
  return a === normalize('Public Area Supervisor') || a === normalize('Public Area Superior');
}

const QUIZ_BLANKS = ['hk-sup', 'pa-sup', 'linen-sup', 'gardener', 'linen-att', 'pest', 'iron'];

export default function OrgChartTree() {
  const [mode, setMode] = useState<'view' | 'quiz'>('view');
  const [values, setValues] = useState<{ [id: string]: string }>({});
  const [statuses, setStatuses] = useState<{ [id: string]: 'idle' | 'correct' | 'wrong' }>({});
  const [checked, setChecked] = useState(false);

  const blanks = mode === 'quiz' ? new Set(QUIZ_BLANKS) : new Set<string>();

  const handleChange = (id: string, val: string) => {
    setValues(v => ({ ...v, [id]: val }));
    if (checked) {
      setStatuses(s => ({ ...s, [id]: 'idle' }));
    }
  };

  const handleCheck = () => {
    const next: typeof statuses = {};
    QUIZ_BLANKS.forEach(id => {
      const target = NODE_BY_ID[id]?.label || '';
      const value = values[id] || '';
      next[id] = id === 'pa-sup' ? (isPaSupAnswer(value) ? 'correct' : 'wrong') : (isMatch(value, target) ? 'correct' : 'wrong');
    });
    setStatuses(next);
    setChecked(true);
  };

  const handleReset = () => {
    setValues({});
    setStatuses({});
    setChecked(false);
  };

  const switchMode = (m: 'view' | 'quiz') => {
    setMode(m);
    handleReset();
  };

  const correctCount = Object.values(statuses).filter(s => s === 'correct').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant={mode === 'view' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('view')}
          className="h-10"
        >
          <Eye className="w-4 h-4 mr-2" />
          View tree
        </Button>
        <Button
          variant={mode === 'quiz' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('quiz')}
          className="h-10"
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Fill the blanks
        </Button>
      </div>

      <div className="rounded-2xl border bg-card">
        <Tree blanks={blanks} values={values} statuses={statuses} onChange={handleChange} />
      </div>

      {mode === 'quiz' && (
        <div className="space-y-3">
          {checked && (
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {correctCount} / {QUIZ_BLANKS.length} correct
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="h-12" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="lg" className="h-12" onClick={handleCheck}>
              Check answers
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Tap a dashed box and type the role. Spelling is forgiving.
          </p>
        </div>
      )}
    </div>
  );
}
