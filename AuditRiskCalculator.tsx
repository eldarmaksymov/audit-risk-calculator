import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const AuditRiskCalculator = () => {
  const [auditRisk, setAuditRisk] = useState(0.05);
  const [inherentRisk, setInherentRisk] = useState(0.5);
  const [controlRisk, setControlRisk] = useState(0.5);
  const [detectionRisk, setDetectionRisk] = useState(0.2);

  useEffect(() => {
    const calculatedDetectionRisk = auditRisk / (inherentRisk * controlRisk);
    setDetectionRisk(Math.min(1, Math.max(0.01, calculatedDetectionRisk)));
  }, [auditRisk, inherentRisk, controlRisk]);

  const formatPercentage = (value) => `${(value * 100).toFixed(1)}%`;

  const getBarColor = (value, isDetectionRisk = false) => {
    if (!isDetectionRisk) {
      if (value < 0.3) return 'bg-green-500';
      if (value < 0.6) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (value < 0.3) return 'bg-red-500';
      if (value < 0.6) return 'bg-yellow-500';
      return 'bg-green-500';
    }
  };

  const getDetectionRiskMessage = (value) => {
    if (value < 0.3) {
      return <span className="font-bold text-red-600">HIGH extent of substantive testing</span>;
    }
    if (value < 0.6) {
      return <span className="font-bold text-yellow-600">MODERATE extent of substantive testing</span>;
    }
    return <span className="font-bold text-green-600">LOW extent of substantive testing</span>;
  };

  const getControlRiskMessage = (value) => {
    if (value >= 1) {
      return <span className="font-bold text-red-600">CANNOT rely on controls if conclude control risk is MAXIMUM (with or without tests of operating effectiveness of controls)</span>;
    }
    if (value > 0.6) {
      return <span className="font-bold text-red-600">LOW reliance on controls if tests of operating effectiveness indicate HIGH level of control risk</span>;
    }
    if (value > 0.3) {
      return <span className="font-bold text-yellow-600">MODERATE reliance on controls if tests of operating effectiveness indicate MODERATE level of control risk</span>;
    }
    return <span className="font-bold text-green-600">HIGH reliance on controls if tests of operating effectiveness indicate LOW level of control risk</span>;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Audit Risk Model Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audit Risk Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Audit Risk</label>
          <Select
            value={auditRisk.toString()}
            onValueChange={(value) => setAuditRisk(parseFloat(value))}
          >
            <SelectTrigger>
              <SelectValue>{formatPercentage(auditRisk)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.05">5%</SelectItem>
              <SelectItem value="0.10">10%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inherent Risk Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Inherent Risk</label>
            <span className="text-sm">{formatPercentage(inherentRisk)}</span>
          </div>
          <Slider
            value={[inherentRisk * 100]}
            onValueChange={(value) => setInherentRisk(value[0] / 100)}
            min={1}
            max={100}
            step={1}
          />
          <div className="flex gap-4">
            <div className="h-4 w-full rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(inherentRisk)} transition-all`}
                style={{ width: `${inherentRisk * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Control Risk Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Control Risk</label>
            <span className="text-sm">{formatPercentage(controlRisk)}</span>
          </div>
          <Slider
            value={[controlRisk * 100]}
            onValueChange={(value) => setControlRisk(value[0] / 100)}
            min={1}
            max={100}
            step={1}
          />
          <div className="flex gap-4 items-center">
            <div className="h-4 w-full rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(controlRisk)} transition-all`}
                style={{ width: `${controlRisk * 100}%` }}
              />
            </div>
            <div className="text-sm min-w-96 text-right">
              {getControlRiskMessage(controlRisk)}
            </div>
          </div>
        </div>

        {/* Detection Risk (Calculated) */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Detection Risk (Calculated)</label>
            <span className="text-sm">{formatPercentage(detectionRisk)}</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-4 w-full rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(detectionRisk, true)} transition-all`}
                style={{ width: `${detectionRisk * 100}%` }}
              />
            </div>
            <div className="text-sm min-w-64 text-right">
              {getDetectionRiskMessage(detectionRisk)}
            </div>
          </div>
        </div>

        {/* Formula Display */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-4">
          <p className="text-sm font-medium">Audit Risk Model Formula:</p>
          <p className="text-blue-600 font-bold text-center">
            Audit Risk = Inherent Risk × Control Risk × Detection Risk
          </p>
          <div className="flex justify-center items-center gap-4 text-sm">
            <div className="text-center">
              <span className="block text-gray-600">Audit Risk</span>
              <span className="font-medium">{formatPercentage(auditRisk)}</span>
            </div>
            <span className="text-xl">=</span>
            <div className="text-center">
              <span className="block text-gray-600">Inherent Risk</span>
              <span className="font-medium">{formatPercentage(inherentRisk)}</span>
            </div>
            <span className="text-xl">×</span>
            <div className="text-center">
              <span className="block text-gray-600">Control Risk</span>
              <span className="font-medium">{formatPercentage(controlRisk)}</span>
            </div>
            <span className="text-xl">×</span>
            <div className="text-center">
              <span className="block text-gray-600">Detection Risk</span>
              <span className="font-medium">{formatPercentage(detectionRisk)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditRiskCalculator;
