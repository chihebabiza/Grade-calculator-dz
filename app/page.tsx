'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Trash2,
    Edit2,
    Save,
    X,
    Plus,
    Moon,
    Sun,
    Calculator,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Module {
    id: string;
    name: string;
    coefficient: number;
    exam: number | null;
    td: number | null;
    tp: number | null;
    scheme: 'exam-only' | 'exam-td' | 'exam-tp' | 'exam-td-tp';
}

interface Weights {
    tdTpWeight: number;
    examWeight: number;
}

export default function MoyenneCalculator() {
    const [modules, setModules] = useState<Module[]>([]);
    const [weights, setWeights] = useState<Weights>({
        tdTpWeight: 0.4,
        examWeight: 0.6,
    });
    const [darkMode, setDarkMode] = useState(false);
    const [editingModule, setEditingModule] = useState<string | null>(null);
    const [editingWeights, setEditingWeights] = useState(false);
    const [tempWeights, setTempWeights] = useState<Weights>(weights);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        coefficient: '',
        exam: '',
        td: '',
        tp: '',
        scheme: 'exam-only' as Module['scheme'],
    });

    // Load data from localStorage on mount
    useEffect(() => {
        const savedModules = localStorage.getItem('moyenne-modules');
        const savedWeights = localStorage.getItem('moyenne-weights');
        const savedTheme = localStorage.getItem('moyenne-theme');

        if (savedModules) {
            setModules(JSON.parse(savedModules));
        }
        if (savedWeights) {
            const parsedWeights = JSON.parse(savedWeights);
            setWeights(parsedWeights);
            setTempWeights(parsedWeights);
        }
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('moyenne-modules', JSON.stringify(modules));
    }, [modules]);

    useEffect(() => {
        localStorage.setItem('moyenne-weights', JSON.stringify(weights));
    }, [weights]);

    useEffect(() => {
        localStorage.setItem('moyenne-theme', darkMode ? 'dark' : 'light');
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const calculateModuleAverage = (module: Module): number => {
        const { exam, td, tp, scheme } = module;
        const { tdTpWeight, examWeight } = weights;

        if (scheme === 'exam-only' && exam !== null) {
            return exam;
        }

        if (scheme === 'exam-td' && exam !== null && td !== null) {
            return td * tdTpWeight + exam * examWeight;
        }

        if (scheme === 'exam-tp' && exam !== null && tp !== null) {
            return tp * tdTpWeight + exam * examWeight;
        }

        if (
            scheme === 'exam-td-tp' &&
            exam !== null &&
            td !== null &&
            tp !== null
        ) {
            return ((td + tp) / 2) * tdTpWeight + exam * examWeight;
        }

        return 0;
    };

    const calculateOverallMoyenne = (): number => {
        if (modules.length === 0) return 0;

        const totalWeightedSum = modules.reduce((sum, module) => {
            const moduleAvg = calculateModuleAverage(module);
            return sum + moduleAvg * module.coefficient;
        }, 0);

        const totalCoefficients = modules.reduce(
            (sum, module) => sum + module.coefficient,
            0
        );

        return totalCoefficients > 0 ? totalWeightedSum / totalCoefficients : 0;
    };

    const addModule = () => {
        if (!formData.name || !formData.coefficient) return;

        const newModule: Module = {
            id: Date.now().toString(),
            name: formData.name,
            coefficient: Number.parseFloat(formData.coefficient),
            exam: formData.exam ? Number.parseFloat(formData.exam) : null,
            td: formData.td ? Number.parseFloat(formData.td) : null,
            tp: formData.tp ? Number.parseFloat(formData.tp) : null,
            scheme: formData.scheme,
        };

        setModules([...modules, newModule]);
        setFormData({
            name: '',
            coefficient: '',
            exam: '',
            td: '',
            tp: '',
            scheme: 'exam-only',
        });
    };

    const deleteModule = (id: string) => {
        setModules(modules.filter((m) => m.id !== id));
    };

    const updateModule = (id: string, updatedModule: Partial<Module>) => {
        setModules(
            modules.map((m) => (m.id === id ? { ...m, ...updatedModule } : m))
        );
        setEditingModule(null);
    };

    const saveWeights = () => {
        if (
            Math.abs(tempWeights.tdTpWeight + tempWeights.examWeight - 1) <
            0.001
        ) {
            setWeights(tempWeights);
            setEditingWeights(false);
        }
    };

    const clearAllData = () => {
        setModules([]);
        localStorage.removeItem('moyenne-modules');
        localStorage.removeItem('moyenne-weights');
        setWeights({ tdTpWeight: 0.4, examWeight: 0.6 });
        setTempWeights({ tdTpWeight: 0.4, examWeight: 0.6 });
    };

    const isWeightValid =
        Math.abs(tempWeights.tdTpWeight + tempWeights.examWeight - 1) < 0.001;

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <div className="container mx-auto p-4 max-w-6xl">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Calculator
                            className="h-8 w-8 text-primary"
                            aria-hidden="true"
                        />
                        <h1 className="text-3xl font-bold">
                            Calculateur de Moyenne
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label={
                            darkMode
                                ? 'Activer le mode clair'
                                : 'Activer le mode sombre'
                        }
                        title={
                            darkMode
                                ? 'Activer le mode clair'
                                : 'Activer le mode sombre'
                        }
                    >
                        {darkMode ? (
                            <Sun className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Moon className="h-4 w-4" aria-hidden="true" />
                        )}
                    </Button>
                </header>

                <main id="main-content">
                    <div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        role="main"
                    >
                        {/* Left Column - Form and Weights */}
                        <section
                            className="space-y-6"
                            aria-label="Formulaire d'ajout de module"
                            id="add-module-form"
                        >
                            {/* Add Module Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        Ajouter un Module
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="module-name">
                                            Nom du Module
                                        </Label>
                                        <Input
                                            id="module-name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="ex: Mathématiques"
                                            aria-describedby="module-name-help"
                                            required
                                        />
                                        <div
                                            id="module-name-help"
                                            className="sr-only"
                                        >
                                            Entrez le nom du module
                                            universitaire
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="coefficient">
                                            Coefficient
                                        </Label>
                                        <Input
                                            id="coefficient"
                                            type="number"
                                            step="0.1"
                                            value={formData.coefficient}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    coefficient: e.target.value,
                                                })
                                            }
                                            placeholder="ex: 3"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="scheme">
                                            Système de Notation
                                        </Label>
                                        <Select
                                            value={formData.scheme}
                                            onValueChange={(
                                                value: Module['scheme']
                                            ) =>
                                                setFormData({
                                                    ...formData,
                                                    scheme: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger aria-label="Sélectionner le système de notation">
                                                <SelectValue placeholder="Choisir un système de notation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="exam-only">
                                                    Examen seulement
                                                </SelectItem>
                                                <SelectItem value="exam-td">
                                                    Examen + TD
                                                </SelectItem>
                                                <SelectItem value="exam-tp">
                                                    Examen + TP
                                                </SelectItem>
                                                <SelectItem value="exam-td-tp">
                                                    Examen + TD + TP
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="exam">
                                            Note Examen
                                        </Label>
                                        <Input
                                            id="exam"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="20"
                                            value={formData.exam}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    exam: e.target.value,
                                                })
                                            }
                                            placeholder="sur 20"
                                        />
                                    </div>

                                    {(formData.scheme === 'exam-td' ||
                                        formData.scheme === 'exam-td-tp') && (
                                        <div>
                                            <Label htmlFor="td">Note TD</Label>
                                            <Input
                                                id="td"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="20"
                                                value={formData.td}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        td: e.target.value,
                                                    })
                                                }
                                                placeholder="sur 20"
                                            />
                                        </div>
                                    )}

                                    {(formData.scheme === 'exam-tp' ||
                                        formData.scheme === 'exam-td-tp') && (
                                        <div>
                                            <Label htmlFor="tp">Note TP</Label>
                                            <Input
                                                id="tp"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="20"
                                                value={formData.tp}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        tp: e.target.value,
                                                    })
                                                }
                                                placeholder="sur 20"
                                            />
                                        </div>
                                    )}

                                    <Button
                                        onClick={addModule}
                                        className="w-full"
                                        disabled={
                                            !formData.name ||
                                            !formData.coefficient
                                        }
                                    >
                                        <Plus
                                            className="h-4 w-4 mr-2"
                                            aria-hidden="true"
                                        />
                                        Ajouter Module
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Weights Configuration */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Poids de Calcul
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            aria-label={
                                                editingWeights
                                                    ? 'Annuler la modification des poids'
                                                    : 'Modifier les poids de calcul'
                                            }
                                            onClick={() => {
                                                if (editingWeights) {
                                                    setTempWeights(weights);
                                                    setEditingWeights(false);
                                                } else {
                                                    setEditingWeights(true);
                                                }
                                            }}
                                        >
                                            {editingWeights ? (
                                                <X
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Edit2
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {editingWeights ? (
                                        <>
                                            <div>
                                                <Label htmlFor="td-weight">
                                                    Poids TD/TP
                                                </Label>
                                                <Input
                                                    id="td-weight"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="1"
                                                    value={
                                                        tempWeights.tdTpWeight
                                                    }
                                                    onChange={(e) =>
                                                        setTempWeights({
                                                            ...tempWeights,
                                                            tdTpWeight:
                                                                Number.parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="exam-weight">
                                                    Poids Examen
                                                </Label>
                                                <Input
                                                    id="exam-weight"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="1"
                                                    value={
                                                        tempWeights.examWeight
                                                    }
                                                    onChange={(e) =>
                                                        setTempWeights({
                                                            ...tempWeights,
                                                            examWeight:
                                                                Number.parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                            {!isWeightValid && (
                                                <Alert>
                                                    <AlertDescription>
                                                        La somme des poids doit
                                                        être égale à 1.0
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <Button
                                                onClick={saveWeights}
                                                disabled={!isWeightValid}
                                                className="w-full"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                Sauvegarder
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Poids TD/TP:</span>
                                                <Badge variant="secondary">
                                                    {weights.tdTpWeight}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Poids Examen:</span>
                                                <Badge variant="secondary">
                                                    {weights.examWeight}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>

                        {/* Middle Column - Modules List */}
                        <section
                            className="space-y-4"
                            aria-label="Liste des modules"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Modules ({modules.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {modules.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">
                                            Aucun module ajouté
                                        </p>
                                    ) : (
                                        <div
                                            className="space-y-3"
                                            role="list"
                                            aria-label="Liste des modules ajoutés"
                                        >
                                            {modules.map((module) => (
                                                <div
                                                    key={module.id}
                                                    role="listitem"
                                                >
                                                    <ModuleCard
                                                        module={module}
                                                        average={calculateModuleAverage(
                                                            module
                                                        )}
                                                        isEditing={
                                                            editingModule ===
                                                            module.id
                                                        }
                                                        onEdit={() =>
                                                            setEditingModule(
                                                                module.id
                                                            )
                                                        }
                                                        onSave={(
                                                            updatedModule
                                                        ) =>
                                                            updateModule(
                                                                module.id,
                                                                updatedModule
                                                            )
                                                        }
                                                        onCancel={() =>
                                                            setEditingModule(
                                                                null
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            deleteModule(
                                                                module.id
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>

                        {/* Right Column - Results */}
                        <section
                            className="space-y-6"
                            aria-label="Résultats et actions"
                        >
                            {/* Overall Average */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Moyenne Générale</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div
                                            className="text-4xl font-bold text-primary mb-2"
                                            aria-label={`Moyenne générale: ${calculateOverallMoyenne().toFixed(
                                                2
                                            )} sur 20`}
                                        >
                                            {calculateOverallMoyenne().toFixed(
                                                2
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            sur 20
                                        </div>
                                        {modules.length > 0 && (
                                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    Calcul: Σ(moyenne × coeff) /
                                                    Σ(coeff)
                                                </div>
                                                <div className="text-xs">
                                                    Total coefficients:{' '}
                                                    {modules.reduce(
                                                        (sum, m) =>
                                                            sum + m.coefficient,
                                                        0
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="destructive"
                                        onClick={clearAllData}
                                        className="w-full"
                                        disabled={modules.length === 0}
                                        aria-label="Effacer toutes les données enregistrées"
                                    >
                                        <Trash2
                                            className="h-4 w-4 mr-2"
                                            aria-hidden="true"
                                        />
                                        Effacer Toutes les Données
                                    </Button>
                                    <div className="text-xs text-muted-foreground text-center">
                                        Les données sont sauvegardées
                                        automatiquement dans votre navigateur
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

interface ModuleCardProps {
    module: Module;
    average: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (module: Partial<Module>) => void;
    onCancel: () => void;
    onDelete: () => void;
}

function ModuleCard({
    module,
    average,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: ModuleCardProps) {
    const [editData, setEditData] = useState(module);

    useEffect(() => {
        setEditData(module);
    }, [module, isEditing]);

    if (isEditing) {
        return (
            <Card className="border-primary">
                <CardContent className="p-4 space-y-3">
                    <Input
                        value={editData.name}
                        onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                        }
                        placeholder="Nom du module"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            type="number"
                            step="0.1"
                            value={editData.coefficient}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    coefficient:
                                        Number.parseFloat(e.target.value) || 0,
                                })
                            }
                            placeholder="Coefficient"
                        />
                        <Select
                            value={editData.scheme}
                            onValueChange={(value: Module['scheme']) =>
                                setEditData({ ...editData, scheme: value })
                            }
                        >
                            <SelectTrigger aria-label="Modifier le système de notation">
                                <SelectValue placeholder="Système de notation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="exam-only">
                                    Examen
                                </SelectItem>
                                <SelectItem value="exam-td">
                                    Examen + TD
                                </SelectItem>
                                <SelectItem value="exam-tp">
                                    Examen + TP
                                </SelectItem>
                                <SelectItem value="exam-td-tp">
                                    Examen + TD + TP
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            value={editData.exam || ''}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    exam: e.target.value
                                        ? Number.parseFloat(e.target.value)
                                        : null,
                                })
                            }
                            placeholder="Examen"
                        />
                        {(editData.scheme === 'exam-td' ||
                            editData.scheme === 'exam-td-tp') && (
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="20"
                                value={editData.td || ''}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        td: e.target.value
                                            ? Number.parseFloat(e.target.value)
                                            : null,
                                    })
                                }
                                placeholder="TD"
                            />
                        )}
                        {(editData.scheme === 'exam-tp' ||
                            editData.scheme === 'exam-td-tp') && (
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="20"
                                value={editData.tp || ''}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        tp: e.target.value
                                            ? Number.parseFloat(e.target.value)
                                            : null,
                                    })
                                }
                                placeholder="TP"
                            />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => onSave(editData)}
                            className="flex-1"
                        >
                            <Save className="h-3 w-3 mr-1" aria-hidden="true" />
                            Sauvegarder
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onCancel}
                            aria-label="Annuler les modifications"
                        >
                            <X className="h-3 w-3" aria-hidden="true" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-semibold">{module.name}</h3>
                        <div className="text-sm text-muted-foreground">
                            Coefficient: {module.coefficient}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onEdit}
                            aria-label={`Modifier le module ${module.name}`}
                        >
                            <Edit2 className="h-3 w-3" aria-hidden="true" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onDelete}
                            aria-label={`Supprimer le module ${module.name}`}
                        >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                <Separator className="my-2" />

                <div className="space-y-1 text-sm">
                    {module.exam !== null && (
                        <div className="flex justify-between">
                            <span>Examen:</span>
                            <span>{module.exam}/20</span>
                        </div>
                    )}
                    {module.td !== null && (
                        <div className="flex justify-between">
                            <span>TD:</span>
                            <span>{module.td}/20</span>
                        </div>
                    )}
                    {module.tp !== null && (
                        <div className="flex justify-between">
                            <span>TP:</span>
                            <span>{module.tp}/20</span>
                        </div>
                    )}
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-center font-semibold">
                    <span>Moyenne:</span>
                    <Badge variant={average >= 10 ? 'default' : 'destructive'}>
                        {average.toFixed(2)}/20
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
