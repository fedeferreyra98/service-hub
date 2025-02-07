import hiringService from "../services/hiring.service.js"
import serviceRepository from "../repositories/service.repository.js";
import {handleError} from "../utils/web/error.js";

export const getByServiceId = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const hiring = await hiringService.getByServiceId(serviceId);
        if (!hiring) {
            return res.status(404).json({ message: "Contratación no encontrada" });
        }
        return res.status(200).json({ hiring });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const hiring = await hiringService.getByUserId(userId);
        if (!hiring) {
            return res.status(404).json({ message: "Contratación no encontrada" });
        }
        return res.status(200).json({ hiring });
    } catch (error) {
        return handleError(res, error);
    }
};

export const create = async (req, res) => {
    try {
        const service = await serviceRepository.getById(req.params.serviceId);
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        const hiringData = req.body;
        const hiring = await hiringService.create({
            ...hiringData,
            userId : service.userId.toString(),
            serviceId : service._id.toString(),
        });
        return res.status(201).location(`/hiring/${hiring._id}`).json({ hiring });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateHiring = async (req, res) => {
    try {
        const hiringId = req.params.hiringId;
        const updateData = req.body;
        const hiring = await hiringService.updateHiring(hiringId, updateData);
        return res.status(204).json({ hiring });
    } catch (error) {
        return handleError(res, error);
    }
};

export const attachServiceNameToHiring = async (req, res) => {
    try {
        const hiring = req.body;
        const hiringWithServiceName = await hiringService.attachServiceNameToHiring(hiring);
        return res.status(200).json({ hiringWithServiceName });
    } catch (error) {
        return handleError(res, error);
    }
}