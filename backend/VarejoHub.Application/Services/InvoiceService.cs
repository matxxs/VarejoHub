using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;

        public InvoiceService(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }

        public async Task AddAsync(Invoice invoice)
        {
            await _invoiceRepository.AddAsync(invoice);
        }

        public async Task UpdateAsync(Invoice invoice)
        {
            await _invoiceRepository.UpdateAsync(invoice);
        }

        public async Task DeleteAsync(int id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice != null)
            {
                invoice.StatusFatura = "Cancelada";
                await _invoiceRepository.UpdateAsync(invoice);
            }
        }

        public Task<Invoice?> GetByIdAsync(int id)
        {
            return _invoiceRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<Invoice>> GetBySubscriptionIdAsync(int subscriptionId)
        {
            return _invoiceRepository.GetInvoicesBySubscriptionIdAsync(subscriptionId);
        }

        public Task<IEnumerable<Invoice>> GetBySupermarketIdAsync(int supermarketId)
        {
            return _invoiceRepository.GetAllBySupermarketIdAsync(supermarketId);
        }

        public Task<IEnumerable<Invoice>> GetByStatusAsync(string status)
        {
            // Need to implement a workaround since the repository doesn't have this exact method
            // We'll get all invoices and filter - not ideal but works for now
            throw new NotImplementedException("This method needs repository enhancement");
        }

        public Task<IEnumerable<Invoice>> GetOverdueAsync()
        {
            return _invoiceRepository.GetOverdueInvoicesAsync(DateOnly.FromDateTime(DateTime.Now));
        }
    }
}
